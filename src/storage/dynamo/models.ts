
import { DynamoModel, DynamoModelConfig } from './dynamo-model';
import { EntitySchema, UniqueNameSchema, KeyringSchema } from './schemas';
import { DataEntity, DataUniqueName, DataKeyring } from '../../entities';
const vogels = require('vogels');

export const EntityModel = new DynamoModel<DataEntity>(EntitySchema);
export const UniqueNameModel = new DynamoModel<DataUniqueName>(UniqueNameSchema);
export const KeyringModel = new DynamoModel<DataKeyring>(KeyringSchema);

export function dynamoConfig(config: DynamoModelConfig) {
    EntityModel.config(config);
    UniqueNameModel.config(config);
    KeyringModel.config(config);
}
export function createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
        vogels.createTables({
            'Entity': { readCapacity: 1, writeCapacity: 1 },
            'UniqueName': { readCapacity: 1, writeCapacity: 1 },
            'Keyring': { readCapacity: 1, writeCapacity: 1 }
        }, function (err: Error) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

