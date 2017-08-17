
import { Observable } from '../../utils';
import { DataEntity } from '../../entities';
import { DataConflictError, DataNotFoundError } from 'entitizer.entities';
import { DataEntityStore } from '../store';

export class MemoryEntityStore implements DataEntityStore {
    private STORE = {};

    create(data: DataEntity): Observable<DataEntity> {
        if (this.STORE[data.id]) {
            return Observable.throw(new DataConflictError({ message: `Entity id=${data.id} already exists!` }));
        }
        this.STORE[data.id] = data;

        return Observable.of(data);
    }

    getById(id: string): Observable<DataEntity> {
        return Observable.of(this.STORE[id]);
    }

    delete(id: string): Observable<DataEntity> {
        const entity = this.STORE[id];
        delete this.STORE[id];
        return Observable.of(entity);
    }
}
