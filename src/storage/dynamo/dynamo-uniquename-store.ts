
const debug = require('debug')('data');
import { Observable, PlainObject } from '../../utils';
import { DataUniqueName } from '../../entities';
import { UniqueNameID, RepUpdateData } from 'entitizer.entities';
import { DataUniqueNameStore } from '../store';
import { DynamoModel } from './dynamo-model';
import { UniqueNameModel } from './models';
import { KeyringStore } from '../keyring';

export class DynamoUniqueNameStore implements DataUniqueNameStore {
    private model: DynamoModel<DataUniqueName>;

    constructor(private keyring: KeyringStore<string>) {
        this.model = UniqueNameModel;
    }

    create(data: DataUniqueName): Observable<DataUniqueName> {
        debug('creating uniquename', data);
        return Observable.fromPromise(this.model.create(data)).mergeMap(un => un && this.keyring.addItems(un.key, [un.entityId]).map(() => un));
    }

    update(data: RepUpdateData<DataUniqueName, UniqueNameID>): Observable<DataUniqueName> {
        return Observable.fromPromise(this.model.update(data));
    }

    getById(id: UniqueNameID): Observable<DataUniqueName> {
        return Observable.fromPromise(this.model.get(id));
    }

    getByIds(ids: UniqueNameID[]): Observable<DataUniqueName[]> {
        return Observable.fromPromise(this.model.getItems(ids));
    }

    delete(id: UniqueNameID): Observable<DataUniqueName> {
        return Observable.fromPromise(this.model.delete(id)).mergeMap(un => un && this.keyring.deleteItems(un.key, [un.entityId]).map(() => un));
    }

    getByEntityId(entityId: string): Observable<DataUniqueName[]> {
        return Observable.fromPromise(<Promise<DataUniqueName[]>>this.model.query({ key: entityId, limit: 100 }));
    }

    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>> {
        return this.keyring.mget(keys);
    }
}
