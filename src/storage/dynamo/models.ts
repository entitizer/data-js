
import { DynamoModel, DynamoModelConfig } from './dynamo-model';
import { EntitySchema, UniqueNameSchema, KeyringSchema } from './schemas';
import { DataEntity, DataUniqueName, DataKeyring } from '../../entities';

export const EntityModel = new DynamoModel<DataEntity>(EntitySchema);
export const UniqueNameModel = new DynamoModel<DataUniqueName>(UniqueNameSchema);
export const KeyringModel = new DynamoModel<DataKeyring>(KeyringSchema);

export function dynamoConfig(config: DynamoModelConfig) {
    EntityModel.config(config);
    UniqueNameModel.config(config);
    KeyringModel.config(config);
}
