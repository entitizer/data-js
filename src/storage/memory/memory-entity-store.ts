
import { Observable, PlainObject } from '../../utils';
import { DataEntity } from '../../entities';
import { DataConflictError, DataNotFoundError, EntityID, RepUpdateData, DataValidationError } from 'entitizer.entities';
import { DataEntityStore } from '../store';

export class MemoryEntityStore implements DataEntityStore {
    private STORE: PlainObject<DataEntity> = {};

    create(data: DataEntity): Observable<DataEntity> {
        if (this.STORE[data.id]) {
            return Observable.throw(new DataConflictError({ message: `Entity id=${data.id} already exists!` }));
        }
        this.STORE[data.id] = data;

        return Observable.of(data);
    }

    update(data: RepUpdateData<DataEntity, EntityID>): Observable<DataEntity> {
        return this.getById(data.id).mergeMap(entity => {
            if (!entity) {
                return Observable.throw(new DataNotFoundError({ message: `Not found entity with id='${data.id}'` }));
            }
            if (data.set) {
                Object.keys(data.set).forEach(prop => (<any>entity)[prop] = (<any>data.set)[prop]);
            }
            if (data.delete && data.delete.length) {
                data.delete.forEach(prop => delete entity[prop]);
            }
            return Observable.of(entity);
        });
    }

    getById(id: string): Observable<DataEntity> {
        if (typeof id !== 'string') {
            return Observable.throw(new DataValidationError({ message: `Invalid data. 'id' is required` }));
        }
        return Observable.of(this.STORE[id]);
    }

    getByIds(ids: string[]): Observable<DataEntity[]> {
        return Observable.from(ids)
            .distinct()
            .map(id => this.STORE[id])
            .filter(item => !!item)
            .toArray();
    }

    delete(id: string): Observable<DataEntity> {
        if (typeof id !== 'string') {
            return Observable.of(new DataValidationError({ message: `Invalid data. 'id' is required` }));
        }
        const entity = this.STORE[id];
        delete this.STORE[id];
        return Observable.of(entity);
    }
}
