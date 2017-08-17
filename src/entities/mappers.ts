
import { Entity, EntityUniqueName } from 'entitizer.entities';
import { DataEntity, DataEntityUniqueName } from './entities';

export interface DataMapper<DE, LE> {
    fromDomain(data: DE): LE
    toDomain(data: LE): DE
}

export class EntityDataMapper implements DataMapper<Entity, DataEntity> {
    fromDomain(data: Entity): DataEntity {
        return data;
    }
    toDomain(data: DataEntity): Entity {
        return data;
    }
}

export class EntityUniqueNameDataMapper implements DataMapper<EntityUniqueName, DataEntityUniqueName> {

    fromDomain(data: EntityUniqueName): DataEntityUniqueName {
        return data;
    }
    toDomain(data: DataEntityUniqueName): EntityUniqueName {
        return data;
    }
}
