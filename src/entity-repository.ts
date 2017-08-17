
import { Observable } from './utils';
import { DataEntityStore } from './storage';
import { EntityRepository, EntityUniqueNameRepository, RepAccessOptions, Entity, RepUpdateData, RepUpdateOptions } from 'entitizer.entities';
import { EntityDataMapper } from './entities';

export class DataEntityRepository implements EntityRepository {
    constructor(private store: DataEntityStore, private mapper: EntityDataMapper) { }

    getByIds(ids: string[], options?: RepAccessOptions): Observable<Entity[]> {
        throw new Error("Method not implemented.");
    }
    getById(id: string, options?: RepAccessOptions): Observable<Entity> {
        return this.store.getById(id).map(item => this.mapper.toDomain(item));
    }
    delete(id: string): Observable<Entity> {
        return this.store.delete(id).map(item => this.mapper.toDomain(item));
    }
    create(data: Entity, options?: RepAccessOptions): Observable<Entity> {
        return this.store.create(data).map(item => this.mapper.toDomain(item));
    }
    update(data: RepUpdateData<Entity, string>, options?: RepUpdateOptions): Observable<Entity> {
        throw new Error("Method not implemented.");
    }
}
