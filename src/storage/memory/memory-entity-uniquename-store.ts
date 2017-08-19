
import { Observable, PlainObject } from '../../utils';
import { DataEntityUniqueName } from '../../entities';
import { DataConflictError, DataNotFoundError, EntityUniqueNameID } from 'entitizer.entities';
import { DataEntityUniqueNameStore } from '../store';
import { NameKeyring, MemoryStorage } from '../keyring';

export class MemoryEntityUniqueNameStore implements DataEntityUniqueNameStore {
    private STORE = {};

    constructor(private keyring: NameKeyring = new NameKeyring(new MemoryStorage())) { }

    create(data: DataEntityUniqueName): Observable<DataEntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        if (this.STORE[id]) {
            return Observable.throw(new DataConflictError({ message: `EntityUniqueName id=${id} already exists!` }));
        }
        this.STORE[id] = data;

        return this.keyring.add(data.entityId, [data.key]).map(() => data);
    }

    getById(data: EntityUniqueNameID): Observable<DataEntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        return Observable.of(this.STORE[id]);
    }

    delete(data: EntityUniqueNameID): Observable<DataEntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        const entity = this.STORE[id];
        delete this.STORE[id];

        return this.keyring.delete(data.entityId, [data.key]).map(() => entity);
    }

    getByEntityId(entityId: string): Observable<DataEntityUniqueName[]> {
        const ids = Object.keys(this.STORE).filter(key => key.split('-')[0] === entityId);
        return Observable.from(ids).map(id => this.STORE[id]);
    }

    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>> {
        return this.keyring.getManyValues(keys);
    }
}

function formatId(entityId: string, key: string) {
    return [entityId, key].join('-');
}
