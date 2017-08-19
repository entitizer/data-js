import { Observable, PlainObject } from './utils';
import { DataEntityUniqueNameStore } from './storage';
import { EntityUniqueNameRepository, RepAccessOptions, EntityUniqueName, EntityUniqueNameID, RepUpdateData, RepUpdateOptions } from 'entitizer.entities';
import { EntityUniqueNameDataMapper } from './entities';

export class DataEntityUniqueNameRepository implements EntityUniqueNameRepository {
    constructor(private store: DataEntityUniqueNameStore, private mapper: EntityUniqueNameDataMapper) { }

    getByEntityId(entityId: string): Observable<EntityUniqueName[]> {
        return this.store.getByEntityId(entityId).map(items => items.map(item => this.mapper.toDomain(item)));
    }
    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>> {
        return this.store.getEntityIdsByKeys(keys);
    }
    update(data: RepUpdateData<EntityUniqueName, EntityUniqueNameID>, options?: RepUpdateOptions): Observable<EntityUniqueName> {
        return this.store.update(data).map(item => this.mapper.toDomain(item));
    }
    getById(id: EntityUniqueNameID, options?: RepAccessOptions): Observable<EntityUniqueName> {
        return this.getById(id).map(item => this.mapper.toDomain(item));
    }
    getByIds(ids: EntityUniqueNameID[], options?: RepAccessOptions): Observable<EntityUniqueName[]> {
        return this.store.getByIds(ids).map(items => items.map(item => this.mapper.toDomain(item)));
    }
    delete(id: EntityUniqueNameID): Observable<EntityUniqueName> {
        return this.delete(id).map(item => this.mapper.toDomain(item));
    }
    create(data: EntityUniqueName, options?: RepAccessOptions): Observable<EntityUniqueName> {
        return this.create(data).map(item => this.mapper.toDomain(item));
    }
}