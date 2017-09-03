
const debug = require('debug')('data');
import { RepUpdateData } from 'entitizer.entities';
import { AnyPlainObject, StringPlainObject } from '../../utils';

export type DynamoModelConfig = {
    tablePrefix?: string
    accessKeyId?: string
    secretAccessKey?: string
    region?: string
    [index: string]: string
}

export class DynamoModel<T> {
    constructor(private model: any) { }

    config(data: DynamoModelConfig) {
        const config = ['accessKeyId', 'secretAccessKey', 'region', 'tableName'].reduce<any>((r, key) => {
            if (data[key]) {
                r[key] = data[key];
            }
            return r;
        }, {});
        this.model.config(config);
    }

    create(data: T): Promise<T> {
        return new Promise((resolve, reject) => {
            this.model.create(data, { overwrite: false }, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.get());
            });
        });
    }

    update(data: RepUpdateData<T, any>): Promise<T> {
        const id = typeof data.id === 'string' || typeof data.id === 'number' ? { id: data.id } : data.id;
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
                resolve(result && result.get());
            });
        });
    }

    delete(id: any): Promise<T> {
        return new Promise((resolve, reject) => {
            this.model.destroy(id, { ReturnValues: true }, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.get());
            });
        });
    }

    get(id: any, options?: { AttributesToGet: string[] }): Promise<T> {
        return new Promise((resolve, reject) => {
            this.model.get(id, options, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.get());
            });
        });
    }

    getItems(ids: any[], options?: { AttributesToGet: string[] }): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.model.getItems(ids, options, (error: Error, result: any) => {
                if (error) { return reject(error) }
                resolve(result && result.get());
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
