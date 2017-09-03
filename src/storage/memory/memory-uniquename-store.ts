
import { Observable, PlainObject } from '../../utils';
import { DataUniqueName } from '../../entities';
import { DataConflictError, UniqueNameID, RepUpdateData, CodeError } from 'entitizer.entities';
import { DataUniqueNameStore } from '../store';
import { NameKeyring } from '../keyring';
import { MemoryKeyringStore } from './memory-keyring-store';

export class MemoryUniqueNameStore implements DataUniqueNameStore {
    private STORE: PlainObject<DataUniqueName> = {};

    constructor(private keyring: NameKeyring = new NameKeyring(new MemoryKeyringStore())) { }

    create(data: DataUniqueName): Observable<DataUniqueName> {
        const id = formatId(data.entityId, data.key);
        if (this.STORE[id]) {
            return Observable.throw(new DataConflictError({ message: `EntityUniqueName id=${id} already exists!` }));
        }
        this.STORE[id] = data;

        return this.keyring.addItems(data.entityId, [data.key]).map(() => data);
    }

    update(data: RepUpdateData<DataUniqueName, UniqueNameID>): Observable<DataUniqueName> {
        return Observable.throw(new CodeError({ message: 'an UniqueName cannot be updated' }));
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
            .toArray();
    }

    delete(data: UniqueNameID): Observable<DataUniqueName> {
        const id = formatId(data.entityId, data.key);
        const entity = this.STORE[id];
        delete this.STORE[id];

        return this.keyring.deleteItems(data.entityId, [data.key]).map(() => entity);
    }

    getByEntityId(entityId: string): Observable<DataUniqueName[]> {
        const ids = Object.keys(this.STORE).filter(key => key.split('-')[0] === entityId);
        return Observable.of(ids.map(id => this.STORE[id]));
    }

    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>> {
        return this.keyring.getManyValues(keys);
    }
}

function formatId(entityId: string, key: string) {
    return [entityId, key].join('-');
}
