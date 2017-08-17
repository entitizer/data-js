
import { Observable } from '../utils';
import { DataEntity, DataEntityUniqueName } from '../entities';
import { EntityUniqueNameID } from 'entitizer.entities';


export interface DataEntityStore {
    create(data: DataEntity): Observable<DataEntity>
    delete(id: string): Observable<DataEntity>
    getById(id: string): Observable<DataEntity>
}

export interface DataEntityUniqueNameStore {
    create(data: DataEntityUniqueName): Observable<DataEntityUniqueName>
    delete(id: EntityUniqueNameID): Observable<DataEntityUniqueName>
    getById(id: EntityUniqueNameID): Observable<DataEntityUniqueName>
}
