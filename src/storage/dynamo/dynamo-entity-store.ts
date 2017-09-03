
import { Observable } from '../../utils';
import { DataEntity } from '../../entities';
import { CodeError, EntityID, RepUpdateData } from 'entitizer.entities';
import { DataEntityStore } from '../store';
import { DynamoModel } from './dynamo-model';
import { EntityModel } from './models';

export class DynamoEntityStore implements DataEntityStore {
    private model: DynamoModel<DataEntity>;
    constructor() {
        this.model = EntityModel;
    }

    create(data: DataEntity): Observable<DataEntity> {
        return Observable.fromPromise(this.model.create(data));
    }

    update(data: RepUpdateData<DataEntity, EntityID>): Observable<DataEntity> {
        return Observable.fromPromise(this.model.update(data));
    }

    getById(id: string): Observable<DataEntity> {
        return Observable.fromPromise(this.model.get(id));
    }

    getByIds(ids: string[]): Observable<DataEntity[]> {
        return Observable.fromPromise(this.model.getItems(ids));
    }

    delete(id: string): Observable<DataEntity> {
        throw new CodeError({ message: 'Entity cannot be deleted' });
        // return Observable.fromPromise(this.model.delete(id));
    }
}
