
import { DataEntityRepository, EntityDataMapper, MemoryEntityStore } from '../src';
import { DataValidationError } from 'entitizer.entities';
import * as assert from 'assert';
import { describe, it } from 'mocha';

describe('DataEntityRepository', function () {
    const entityRepository = new DataEntityRepository(new MemoryEntityStore(), new EntityDataMapper());
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
            it('should ' + (data.error ? 'fail' : 'success') + ' create ' + name, function (done) {
                entityRepository.create(data.entity).subscribe(
                    result => {
                        if (data.error) {
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
