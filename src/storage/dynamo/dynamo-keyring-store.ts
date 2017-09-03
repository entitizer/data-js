
import { KeyStore } from '../keyring/key-store';
import { Observable, PlainObject } from '../../utils';
import { DataKeyring } from '../../entities';
import { CodeError, EntityID, RepUpdateData } from 'entitizer.entities';
import { DynamoModel } from './dynamo-model';
import { KeyringModel } from './models';

export class DynamoKeyringStore implements KeyStore<string> {
    private model: DynamoModel<DataKeyring>;
    constructor() {
        this.model = KeyringModel;
    }

    get(key: string): Observable<string[]> {
        return Observable.fromPromise(this.model.get(key)).map(result => result && result.ids);
    }

    addItems(key: string, items: string[]): Observable<number> {
        return this.get(key)
            .mergeMap(values => {
                if (values && values.length) {
                    items.forEach(item => (values.indexOf(item) < 0) && values.push(item));
                    return this.set(key, values);
                }
                return this.set(key, items);
            });
    }

    mget(keys: string[]): Observable<PlainObject<string[]>> {
        return Observable.fromPromise(this.model.getItems(keys))
            .map(items => items.reduce<PlainObject<string[]>>((r, item) => {
                r[item.key] = item.ids;
                return r;
            }, {}));
    }

    set(key: string, items: string[]): Observable<number> {
        return Observable.fromPromise(this.model.put({ key: key, ids: items })).mapTo(items.length);
    }

    delete(key: string): Observable<number> {
        return Observable.fromPromise(this.model.delete(key)).map(result => result && result.ids && result.ids.length || 0);
    }

    deleteItems(key: string, items: string[]): Observable<number> {
        return this.get(key).mergeMap(values => {
            if (!values || values.length === 0) {
                return Observable.of(0);
            }
            const total = values.length;
            // remove existing items
            items.forEach(item => {
                const i = values.indexOf(item);
                if (i > -1) {
                    values.splice(i, 1);
                }
            });

            return this.set(key, values).mapTo(total - values.length);
        });
    }
}