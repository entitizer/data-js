
const debug = require('debug')('data');
import { Observable, PlainObject } from '../../utils';
import { DataUniqueName } from '../../entities';
import { UniqueNameID, RepUpdateData } from 'entitizer.entities';
import { DataUniqueNameStore } from '../store';
import { DynamoModel } from './dynamo-model';
import { UniqueNameModel } from './models';
import { DynamoKeyringStore } from './dynamo-keyring-store';

export class DynamoUniqueNameStore implements DataUniqueNameStore {
    private model: DynamoModel<DataUniqueName>;
    private keyring: DynamoKeyringStore;

    constructor() {
        this.model = UniqueNameModel;
        this.keyring = new DynamoKeyringStore();
    }

    create(data: DataUniqueName): Observable<DataUniqueName> {
        debug('creating uniquename', data);
        return Observable.fromPromise(this.model.create(data)).mergeMap(un => un && this.keyring.addItems(un.entityId, [un.key]).map(() => un));
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
        return Observable.fromPromise(this.model.delete(id)).mergeMap(un => un && this.keyring.deleteItems(un.entityId, [un.key]).map(() => un));
    }

    getByEntityId(entityId: string): Observable<DataUniqueName[]> {
        throw new Error("Method not implemented.");
    }

    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>> {
        return this.keyring.mget(keys);
    }
}
