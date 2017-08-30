
import { KeyStore } from '../keyring/key-store';
import { Observable, PlainObject } from '../../utils';

/**
 * MemoryStorage class. For tests.
 */
export class MemoryKeyringStore<T> implements KeyStore<T> {
    private store: PlainObject<T[]> = {};
    constructor() { }

    get(key: string): Observable<T[]> {
        return Observable.of(this.store[key] || []);
    }

    addItems(key: string, items: T[]): Observable<number> {
        return this.get(key)
            .mergeMap(values => {
                if (values.length) {
                    items.forEach(item => (values.indexOf(item) < 0) && values.push(item));
                    return Observable.of(values.length);
                }
                return this.set(key, items);
            });
    }

    mget(keys: string[]): Observable<PlainObject<T[]>> {
        return Observable.of(keys.reduce<PlainObject<T[]>>((data, key) => {
            data[key] = this.store[key] || [];
            return data;
        }, {}));
    }

    set(key: string, items: T[]): Observable<number> {
        this.store[key] = items;
        return Observable.of(items.length);
    }

    delete(key: string): Observable<number> {
        return this.get(key)
            .map(values => {
                delete this.store[key];
                return values.length;
            });
    }

    deleteItems(key: string, items: T[]): Observable<number> {
        return this.get(key).map(values => {
            if (values.length === 0) {
                return 0;
            }
            const total = values.length;
            // remove existing items
            items.forEach(item => {
                const i = values.indexOf(item);
                if (i > -1) {
                    values.splice(i, 1);
                }
            });

            return total - values.length;
        });
    }
}