
import { KeyStorage } from './key-storage';
import { Observable, PlainObject } from '../../utils';
const NodeCache = require('node-cache');

/**
 * MemoryStorage class. For tests.
 */
export class MemoryStorage<T> implements KeyStorage<T> {
    private store: any;
    constructor() {
        this.store = new NodeCache();
    }

    get(key: string): Observable<T[]> {
        return Observable.of(this.store.get(key) || []);
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
        return Observable.of(this.store.mget(keys));
    }

    set(key: string, items: T[]): Observable<number> {
        this.store.set(key, items);
        return Observable.of(items.length);
    }

    delete(key: string): Observable<number> {
        return this.get(key)
            .map(values => {
                this.store.del(key);
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