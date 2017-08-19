
import { Entity, UniqueName } from 'entitizer.entities';
import { DataEntity, DataUniqueName } from './entities';

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

export class UniqueNameDataMapper implements DataMapper<UniqueName, DataUniqueName> {

    fromDomain(data: UniqueName): DataUniqueName {
        return data;
    }
    toDomain(data: DataUniqueName): UniqueName {
        return data;
    }
}
