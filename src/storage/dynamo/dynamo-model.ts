
const debug = require('debug')('data');
import { RepUpdateData } from 'entitizer.entities';
import { AnyPlainObject, StringPlainObject } from '../../utils';
const AWS = require('vogels').AWS;

export type DynamoModelConfig = {
    tablePrefix?: string
    accessKeyId?: string
    secretAccessKey?: string
    region?: string
    endpoint?: string
    [index: string]: string
}

export class DynamoModel<T> {
    constructor(private model: any) { }

    config(data: DynamoModelConfig) {
        let hasConfig = false;
        const config = ['accessKeyId', 'secretAccessKey', 'region', 'endpoint'].reduce<any>((r, key) => {
            if (data[key]) {
                r[key] = data[key];
                hasConfig = true;
            }
            return r;
        }, {});
        debug('set config', config);
        this.model.config({ tableName: data.tableName, dynamodb: hasConfig ? new AWS.DynamoDB(config) : undefined });
    }

    create(data: T): Promise<T> {
        return new Promise((resolve, reject) => {
            this.model.create(data, { overwrite: false }, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.toJSON());
            });
        });
    }

    put(data: T): Promise<T> {
        return new Promise((resolve, reject) => {
            this.model.create(data, { overwrite: true }, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.toJSON());
            });
        });
    }

    update(data: RepUpdateData<T, any>): Promise<T> {
        const id = data.id;//typeof data.id === 'string' || typeof data.id === 'number' ? { id: data.id } : data.id;
        const expression = new UpdateExpression();
        if (data.set) {
            for (let prop in data.set) {
                expression.set(prop, data.set[prop]);
            }
        }
        if (data.remove) {
            expression.remove(data.remove);
        }

        const params = expression.params();

        debug('update params', params);

        return new Promise((resolve, reject) => {
            this.model.update(id, params, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.toJSON());
            });
        });
    }

    delete(id: any): Promise<T> {
        return new Promise((resolve, reject) => {
            this.model.destroy(id, { ReturnValues: true }, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.toJSON());
            });
        });
    }

    get(id: any, options?: { AttributesToGet: string[] }): Promise<T> {
        return new Promise((resolve, reject) => {
            this.model.get(id, options, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.toJSON());
            });
        });
    }

    getItems(ids: any[], options?: { AttributesToGet: string[] }): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.model.getItems(ids, options, (error: Error, result: any) => {
                if (error) { return reject(error) }
                debug('getting items', ids, result);
                resolve(result || []);
            });
        });
    }
}

type UpdateParams = { UpdateExpression: string, ExpressionAttributeNames: StringPlainObject, ExpressionAttributeValues: AnyPlainObject }

class UpdateExpression {
    private SET: string[] = []
    private REMOVE: string[] = []
    private Names: StringPlainObject = {}
    private Values: AnyPlainObject = {}

    private setValue(name: string, value: any, fn?: (value: any) => any): string {
        const key = name.replace(/[^a-zA-Z0-9]+/g, '_');
        if (this.Names['#' + key] !== undefined) {
            throw new Error(`field '${name}' has been set`);
        }
        this.Names['#' + key] = name;
        this.Values[':' + key] = typeof fn === 'function' ? fn(value) : value;

        return key;
    }

    set(name: string, value: any) {
        const key = this.setValue(name, value);
        this.SET.push('#' + key + ' = :' + key);

        return this;
    }

    remove(names: string[]) {
        this.REMOVE = this.REMOVE.concat(names);

        return this;
    }

    params(): UpdateParams {
        const expression: string[] = this.SET.length > 0 ? ['SET ' + this.SET.join(', ')] : [];
        if (this.REMOVE.length) {
            expression.push('REMOVE ' + this.REMOVE.join(', '));
        }
        const params: UpdateParams = { UpdateExpression: expression.join(' '), ExpressionAttributeNames: this.Names, ExpressionAttributeValues: this.Values };

        return params;
    }
}
