
import { Entity, EntityUniqueName } from 'entitizer.entities';
import { LocalEntity, LocalEntityUniqueName } from './entities';

export interface DataMapper<DE, LE> {
    fromDomain(data: DE): LE
    toDomain(data: LE): DE
}

export class EntityModelDataMapper implements DataMapper<Entity, LocalEntity> {
    fromDomain(data: Entity): LocalEntity {
        return data;
    }
    toDomain(data: LocalEntity): Entity {
        return data;
    }
}

export class EntityUniqueNameModelDataMapper implements DataMapper<EntityUniqueName, LocalEntityUniqueName> {

    fromDomain(data: EntityUniqueName): LocalEntityUniqueName {
        return data;
    }
    toDomain(data: LocalEntityUniqueName): EntityUniqueName {
        return data;
    }
}
