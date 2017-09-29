
import { Observable } from './utils';
import { DataEntityStore } from './storage';
import { EntityRepository, RepAccessOptions, Entity, RepUpdateData, RepUpdateOptions } from 'entitizer.entities';
import { EntityDataMapper } from './entities';

export class DataEntityRepository implements EntityRepository {
    constructor(private store: DataEntityStore, private mapper: EntityDataMapper) { }

    getByIds(ids: string[], options?: RepAccessOptions): Observable<Entity[]> {
        return this.store.getByIds(ids, convertOptions(options)).map(items => items.map(item => this.mapper.toDomain(item)));
    }
    getById(id: string, options?: RepAccessOptions): Observable<Entity> {
        return this.store.getById(id, convertOptions(options)).map(item => this.mapper.toDomain(item));
    }
    delete(id: string): Observable<Entity> {
        return this.store.delete(id).map(item => this.mapper.toDomain(item));
    }
    create(data: Entity, options?: RepAccessOptions): Observable<Entity> {
        return this.store.create(data).map(item => this.mapper.toDomain(item));
    }
    update(data: RepUpdateData<Entity, string>, options?: RepUpdateOptions): Observable<Entity> {
        return this.store.update(data).map(item => this.mapper.toDomain(item));
    }
}

function convertOptions(options?: RepAccessOptions) {
    if (options && options.fields && options.fields.length) {
        return { AttributesToGet: options.fields };
    }
}
