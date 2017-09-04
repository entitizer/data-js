
const DynamoDbLocal = require('dynamodb-local');
const dynamoLocalPort = 8000;

import { DataEntityRepository, EntityDataMapper, DynamoEntityStore, dynamoConfig, dynamoCreateTables } from '../src';
import { DataValidationError } from 'entitizer.entities';
import * as assert from 'assert';
import { describe, it, before, after } from 'mocha';

before(function () {
    this.timeout(1000 * 60 * 5);

    return DynamoDbLocal.launch(dynamoLocalPort, null, ['-sharedDb', '-inMemory'])
        .then(dynamoCreateTables);
});

dynamoConfig({ accessKeyId: 'id', secretAccessKey: 'key', endpoint: 'http://localhost:' + dynamoLocalPort, region: 'dynamodb-local-frankfurt' });

after(() => DynamoDbLocal.stop(dynamoLocalPort));

describe('dynamodb DataEntityRepository', function () {
    const entityRepository = new DataEntityRepository(new DynamoEntityStore(), new EntityDataMapper());
    const entities = {
        noLang: {
            entity: {
                wikiId: 'Q41',
                name: 'Greece'
            },
            error: {
                type: DataValidationError,
                // message: `'id'`
            }
        },
        Q41: {
            entity: {
                id: 'ENQ41',
                wikiId: 'Q41',
                lang: 'en',
                name: 'Greece'
            }
        }
    };

    describe('#create', function () {
        Object.keys(entities).forEach(name => {
            const data = entities[name];
            // console.log('data=', data);
            it('should ' + (data.error ? 'fail' : 'success') + ' create ' + name, function (done) {
                entityRepository.create(data.entity).subscribe(
                    result => {
                        if (data.error) {
                            // console.log('result=', result);
                            return done(new Error('Should not pass'));
                        }
                        done();
                    },
                    error => {
                        if (!data.error) {
                            return done(error);
                        }

                        data.error.type && assert.ok(error instanceof data.error.type);
                        data.error.message && assert.ok(error.message.indexOf(data.error.message) > 0, error.message);
                        done();
                    }
                );
            });
        });
    });
    describe('#getById', function () {
        Object.keys(entities).forEach(name => {
            const data = entities[name];
            it('should ' + (data.error ? 'fail' : 'success') + ' get entity by id == ' + data.entity.id, function (done) {
                entityRepository.getById(data.entity.id).subscribe(
                    entity => {
                        if (data.error) {
                            return done(new Error('Should not pass'));
                        }
                        if (data.entity === entity) {
                            return done();
                        }

                        for (let key in data.entity) {
                            assert.equal(entity[key], data.entity[key]);
                        }
                        done();
                    },
                    error => {
                        if (!data.error) {
                            return done(error);
                        }

                        data.error.type && assert.ok(error instanceof data.error.type);
                        data.error.message && assert.ok(error.message.indexOf(data.error.message) > 0, error.message);
                        done();
                    }
                );
            });
        });
    });
});
