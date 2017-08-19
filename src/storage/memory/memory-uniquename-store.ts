
import { Observable, PlainObject } from '../../utils';
import { DataUniqueName } from '../../entities';
import { DataConflictError, DataNotFoundError, UniqueNameID, RepUpdateData } from 'entitizer.entities';
import { DataUniqueNameStore } from '../store';
import { NameKeyring, MemoryStorage } from '../keyring';

export class MemoryUniqueNameStore implements DataUniqueNameStore {
    private STORE: PlainObject<DataUniqueName> = {};

    constructor(private keyring: NameKeyring = new NameKeyring(new MemoryStorage())) { }

    create(data: DataUniqueName): Observable<DataUniqueName> {
        const id = formatId(data.entityId, data.key);
        if (this.STORE[id]) {
            return Observable.throw(new DataConflictError({ message: `EntityUniqueName id=${id} already exists!` }));
        }
        this.STORE[id] = data;

        return this.keyring.add(data.entityId, [data.key]).map(() => data);
    }

    update(data: RepUpdateData<DataUniqueName, UniqueNameID>): Observable<DataUniqueName> {
        throw new Error("Method not implemented.");
    }

    getById(data: UniqueNameID): Observable<DataUniqueName> {
        const id = formatId(data.entityId, data.key);
        return Observable.of(this.STORE[id]);
    }

    getByIds(ids: UniqueNameID[]): Observable<DataUniqueName[]> {
        return Observable.from(ids)
            .map(id => formatId(id.entityId, id.key))
            .distinct()
            .map(id => this.STORE[id])
            .filter(item => !!item)
            .combineAll();
    }

    delete(data: UniqueNameID): Observable<DataUniqueName> {
        const id = formatId(data.entityId, data.key);
        const entity = this.STORE[id];
        delete this.STORE[id];

        return this.keyring.delete(data.entityId, [data.key]).map(() => entity);
    }

    getByEntityId(entityId: string): Observable<DataUniqueName[]> {
        const ids = Object.keys(this.STORE).filter(key => key.split('-')[0] === entityId);
        return Observable.from(ids)
            .map(id => this.STORE[id])
            .combineAll();
    }

    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>> {
        return this.keyring.getManyValues(keys);
    }
}

function formatId(entityId: string, key: string) {
    return [entityId, key].join('-');
}
