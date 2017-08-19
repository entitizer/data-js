
const vogels = require('vogels');
import * as Joi from 'joi';

const prefix = process.env.ENTITIZER_DATA_TABLE_PTEFIX || 'Entitizer_v0_';

export const Entity = vogels.define('Entity', {
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
        data: Joi.object().pattern(/^[a-zA-Z][a-zA-Z0-9_]$/, Joi.string().required()),
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
    tableName: prefix + 'Entities'
});

export const EntityUniqueName = vogels.define('EntityUniqueName', {
    hashKey: 'entitiId',
    rangeKey: 'key',
    timestamps: false,

    schema: {
        entitiId: Joi.string().required(),
        key: Joi.string().required(),
        lang: Joi.string().required(),
        name: Joi.string().required(),
        uniqueName: Joi.string().required(),
        /**
         * created at timestamp
         */
        createdAt: Joi.number().integer().positive().required()
    },
    tableName: prefix + 'EntityUniqueNames'
});
