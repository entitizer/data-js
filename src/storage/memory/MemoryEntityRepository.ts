
import { Observable } from '../../utils';
import { LocalEntity } from '../../entities';
import { DataConflictError, DataNotFoundError } from 'entitizer.entities';

export class MemoryEntityRepository {
    private STORE = {};

    create(data: LocalEntity): Observable<LocalEntity> {
        if (this.STORE[data.id]) {
            return Observable.throw(new DataConflictError({ message: `Entity id=${data.id} already exists!` }));
        }
        this.STORE[data.id] = data;

        return Observable.of(data);
    }

    getById(id: string): Observable<LocalEntity> {
        return Observable.of(this.STORE[id]);
    }
}
