
const vogels = require('vogels');
import * as Joi from 'joi';

const prefix = process.env.ENTITIZER_DATA_TABLE_PTEFIX || 'entitizer_v0';

export const EntityTableName = 'entities';
export const UniqueNameTableName = 'uniquenames';
export const KeyringTableName = 'keyrings';

export const EntitySchema = vogels.define('Entity', {
    hashKey: 'id',
    timestamps: false,

    schema: {
        id: Joi.string().required(),
        lang: Joi.string().required(),
        wikiId: Joi.string().required(),
        name: Joi.string().required(),
        abbr: Joi.string(),
        description: Joi.string(),
        wikiPageId: Joi.number().integer().positive(),
        aliases: Joi.array().items(Joi.string().required()),
        extract: Joi.string(),
        wikiTitle: Joi.string(),
        type: Joi.string(),
        types: Joi.array().items(Joi.string().required()),
        cc2: Joi.string(),
        rank: Joi.number().integer().positive(),
        data: Joi.object({}).pattern(/^P\d+$/, Joi.array().items(Joi.string().required())),
        /**
         * created at timestamp
         */
        createdAt: Joi.number().integer().positive().required(),
        /**
         * updated at timestamp
         */
        updatedAt: Joi.number().integer().positive(),

        redirectId: Joi.string()
    },
    tableName: prefix + '_' + EntityTableName
});

export const UniqueNameSchema = vogels.define('UniqueName', {
    hashKey: 'entityId',
    rangeKey: 'key',
    timestamps: false,

    schema: {
        entityId: Joi.string().required(),
        key: Joi.string().required(),
        lang: Joi.string().required(),
        name: Joi.string().required(),
        uniqueName: Joi.string().required(),
        /**
         * created at timestamp
         */
        createdAt: Joi.number().integer().positive().required()
    },
    tableName: prefix + '_' + UniqueNameTableName
});

export const KeyringSchema = vogels.define('Keyring', {
    hashKey: 'key',
    timestamps: false,

    schema: {
        key: Joi.string().required(),
        ids: vogels.types.stringSet().required()
    },
    tableName: prefix + '_' + KeyringTableName
});
