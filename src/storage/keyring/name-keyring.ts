
const debug = require('debug')('data:keyring');

import { KeyStorage } from './key-storage';
import { md5, Observable, PlainObject, uniq } from '../../utils';
import { EntityUniqueNameHelper } from 'entitizer.entities';
const atonic = require('atonic');

export class NameKeyring {
    private _storage: KeyStorage<string>;

    constructor(storage: KeyStorage<string>) {
        if (!storage) {
            throw new Error('`storage` param is required');
        }
        this._storage = storage;
    }

    getManyValues(keys: string[]): Observable<PlainObject<string[]>> {
        return this._storage.mget(keys);
    }

    getValues(key: string): Observable<string[]> {
        return this._storage.get(key);
    }

    add(entityId: string, keys: string[]): Observable<number> {
        keys = uniq(keys);
        return Observable.from(keys)
            .mergeMap(key => this._storage.addItems(key, [entityId]))
            .count();
    }

    delete(entityId: string, keys: string[]): Observable<number> {
        keys = uniq(keys);
        return Observable.from(keys)
            .mergeMap(key => this._storage.deleteItems(key, [entityId]))
            .filter(count => count > 0)
            .count();
    }
}