
// const debug = require('debug')('data:keyring');

import { KeyStore } from './key-store';
import { Observable, PlainObject, uniq } from '../../utils';

export class NameKeyring {
    private _store: KeyStore<string>;

    constructor(store: KeyStore<string>) {
        if (!store) {
            throw new Error('`store` param is required');
        }
        this._store = store;
    }

    getManyValues(keys: string[]): Observable<PlainObject<string[]>> {
        return this._store.mget(keys);
    }

    getValues(key: string): Observable<string[]> {
        return this._store.get(key);
    }

    addItems(entityId: string, keys: string[]): Observable<number> {
        keys = uniq(keys);
        return Observable.from(keys)
            .mergeMap(key => this._store.addItems(key, [entityId]));
    }

    deleteItems(entityId: string, keys: string[]): Observable<number> {
        keys = uniq(keys);
        return Observable.from(keys)
            .mergeMap(key => this._store.deleteItems(key, [entityId]))
            .filter(count => count > 0);
    }
}