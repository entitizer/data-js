
import { Observable } from '../../utils';
import { LocalEntityUniqueName } from '../../entities';
import { DataConflictError, DataNotFoundError } from 'entitizer.entities';

export class MemoryEntityUniqueNameRepository {
    private STORE = {};

    create(data: LocalEntityUniqueName): Observable<LocalEntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        if (this.STORE[id]) {
            return Observable.throw(new DataConflictError({ message: `EntityUniqueName id=${id} already exists!` }));
        }
        this.STORE[id] = data;

        return Observable.of(data);
    }

    getById(data: { entityId: string, key: string }): Observable<LocalEntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        return Observable.of(this.STORE[id]);
    }
}

function formatId(entityId: string, key: string) {
    return [entityId, key].join('-');
}
