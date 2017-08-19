
import { Observable, PlainObject } from '../utils';
import { DataEntity, DataUniqueName } from '../entities';
import { UniqueNameID, RepUpdateData, EntityID } from 'entitizer.entities';


export interface DataEntityStore {
    create(data: DataEntity): Observable<DataEntity>
    update(data: RepUpdateData<DataEntity, EntityID>): Observable<DataEntity>
    delete(id: string): Observable<DataEntity>
    getById(id: string): Observable<DataEntity>
    getByIds(ids: string[]): Observable<DataEntity[]>
}

export interface DataUniqueNameStore {
    create(data: DataUniqueName): Observable<DataUniqueName>
    update(data: RepUpdateData<DataUniqueName, UniqueNameID>): Observable<DataUniqueName>
    delete(id: UniqueNameID): Observable<DataUniqueName>
    getById(id: UniqueNameID): Observable<DataUniqueName>
    getByIds(ids: UniqueNameID[]): Observable<DataUniqueName[]>
    getByEntityId(entityId: string): Observable<DataUniqueName[]>
    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>>
}
