
import { DynamoModel, DynamoModelConfig } from './dynamo-model';
import { EntitySchema, UniqueNameSchema } from './schemas';
import { DataEntity, DataUniqueName } from '../../entities';

export const EntityModel = new DynamoModel<DataEntity>(EntitySchema);
export const UniqueNameModel = new DynamoModel<DataUniqueName>(UniqueNameSchema);

export function dynamoConfig(config: DynamoModelConfig) {
    EntityModel.config(config);
    UniqueNameModel.config(config);
}
