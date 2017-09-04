
import { KeyringStore } from './keyring-store';
import { RedisClient } from 'redis';
import { PlainObject, uniq, Observable } from '../../utils';

export class RedisKeyringStore implements KeyringStore<string> {
    constructor(private client: RedisClient) { }

    get(key: string): Observable<string[]> {
        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.client.get(key, (error: Error, value: string) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(value && value.split('|') || []);
                });
            })
        );
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
        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.client.mget(keys, (error: Error, values: string[]) => {
                    if (error) {
                        return reject(error);
                    }
                    const data = (values || []).reduce<PlainObject<string[]>>((r, item, i) => {
                        if (item) {
                            r[keys[i]] = item.split('|');
                        }
                        return r;
                    }, {});
                    resolve(data);
                });
            })
        );
    }

    set(key: string, items: string[]): Observable<number> {
        if (items && items.length) {
            items = uniq(items);
            return Observable.fromPromise(
                new Promise((resolve, reject) => {
                    this.client.set(key, items.join('|'), (error: Error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(items.length);
                    });
                })
            );
        }
        return this.delete(key);
    }

    delete(key: string): Observable<number> {
        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                this.client.del(key, (error: Error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            })
        );
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