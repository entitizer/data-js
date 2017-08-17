
import { Observable } from '../../utils';
import { DataEntityUniqueName } from '../../entities';
import { DataConflictError, DataNotFoundError, EntityUniqueNameID } from 'entitizer.entities';
import { DataEntityUniqueNameStore } from '../store';

export class MemoryEntityUniqueNameStore implements DataEntityUniqueNameStore {
    private STORE = {};

    create(data: DataEntityUniqueName): Observable<DataEntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        if (this.STORE[id]) {
            return Observable.throw(new DataConflictError({ message: `EntityUniqueName id=${id} already exists!` }));
        }
        this.STORE[id] = data;

        return Observable.of(data);
    }

    getById(data: EntityUniqueNameID): Observable<DataEntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        return Observable.of(this.STORE[id]);
    }

    delete(data: EntityUniqueNameID): Observable<DataEntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        const entity = this.STORE[id];
        delete this.STORE[id];
        return Observable.of(entity);
    }
}

function formatId(entityId: string, key: string) {
    return [entityId, key].join('-');
}
