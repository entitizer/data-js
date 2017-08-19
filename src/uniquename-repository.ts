import { Observable, PlainObject } from './utils';
import { DataUniqueNameStore } from './storage';
import { UniqueNameRepository, RepAccessOptions, UniqueName, UniqueNameID, RepUpdateData, RepUpdateOptions } from 'entitizer.entities';
import { UniqueNameDataMapper } from './entities';

export class DataUniqueNameRepository implements UniqueNameRepository {
    constructor(private store: DataUniqueNameStore, private mapper: UniqueNameDataMapper) { }

    getByEntityId(entityId: string): Observable<UniqueName[]> {
        return this.store.getByEntityId(entityId).map(items => items.map(item => this.mapper.toDomain(item)));
    }
    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>> {
        return this.store.getEntityIdsByKeys(keys);
    }
    update(data: RepUpdateData<UniqueName, UniqueNameID>, options?: RepUpdateOptions): Observable<UniqueName> {
        return this.store.update(data).map(item => this.mapper.toDomain(item));
    }
    getById(id: UniqueNameID, options?: RepAccessOptions): Observable<UniqueName> {
        return this.getById(id).map(item => this.mapper.toDomain(item));
    }
    getByIds(ids: UniqueNameID[], options?: RepAccessOptions): Observable<UniqueName[]> {
        return this.store.getByIds(ids).map(items => items.map(item => this.mapper.toDomain(item)));
    }
    delete(id: UniqueNameID): Observable<UniqueName> {
        return this.delete(id).map(item => this.mapper.toDomain(item));
    }
    create(data: UniqueName, options?: RepAccessOptions): Observable<UniqueName> {
        return this.create(data).map(item => this.mapper.toDomain(item));
    }
}