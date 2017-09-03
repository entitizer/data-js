
import { Observable, PlainObject } from '../../utils';
import { DataUniqueName } from '../../entities';
import { UniqueNameID, RepUpdateData } from 'entitizer.entities';
import { DataUniqueNameStore } from '../store';
import { DynamoModel } from './dynamo-model';
import { UniqueNameModel } from './models';

export class DynamoUniqueNameStore implements DataUniqueNameStore {
    private model: DynamoModel<DataUniqueName>;

    constructor() {
        this.model = UniqueNameModel;
    }

    create(data: DataUniqueName): Observable<DataUniqueName> {
        return Observable.fromPromise(this.model.create(data));
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
        return Observable.fromPromise(this.model.delete(id));
    }

    getByEntityId(entityId: string): Observable<DataUniqueName[]> {
        throw new Error("Method not implemented.");
    }

    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>> {
        throw new Error("Method not implemented.");
    }
}
