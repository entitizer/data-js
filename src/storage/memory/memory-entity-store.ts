
import { Observable, PlainObject } from '../../utils';
import { DataEntity } from '../../entities';
import { DataConflictError, DataNotFoundError, EntityID, RepUpdateData, DataValidationError } from 'entitizer.entities';
import { DataEntityStore } from '../store';

export class MemoryEntityStore implements DataEntityStore {
    private STORE: PlainObject<DataEntity> = {};

    create(data: DataEntity): Observable<DataEntity> {
        if (typeof data.id !== 'string') {
            return Observable.throw(new DataValidationError({ message: `Invalid data. 'id' is required` }));
        }
        if (this.STORE[data.id]) {
            return Observable.throw(new DataConflictError({ message: `Entity id=${data.id} already exists!` }));
        }
        this.STORE[data.id] = data;

        return Observable.of(data);
    }

    update(data: RepUpdateData<DataEntity, EntityID>): Observable<DataEntity> {
        throw new Error("Method not implemented.");
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
            .combineAll();
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
