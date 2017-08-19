
import { Observable, PlainObject } from '../utils';
import { DataEntity, DataEntityUniqueName } from '../entities';
import { EntityUniqueNameID, RepUpdateData, EntityID } from 'entitizer.entities';


export interface DataEntityStore {
    create(data: DataEntity): Observable<DataEntity>
    update(data: RepUpdateData<DataEntity, EntityID>): Observable<DataEntity>
    delete(id: string): Observable<DataEntity>
    getById(id: string): Observable<DataEntity>
    getByIds(ids: string[]): Observable<DataEntity[]>
}

export interface DataEntityUniqueNameStore {
    create(data: DataEntityUniqueName): Observable<DataEntityUniqueName>
    update(data: RepUpdateData<DataEntityUniqueName, EntityUniqueNameID>): Observable<DataEntityUniqueName>
    delete(id: EntityUniqueNameID): Observable<DataEntityUniqueName>
    getById(id: EntityUniqueNameID): Observable<DataEntityUniqueName>
    getByIds(ids: EntityUniqueNameID[]): Observable<DataEntityUniqueName[]>
    getByEntityId(entityId: string): Observable<DataEntityUniqueName[]>
    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>>
}
