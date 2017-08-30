
import { PlainObject, Observable } from '../../utils';

export interface KeyStore<T> {
    /**
     * Set items for a key
     * @return Total key items count
     */
    set(key: string, items: T[]): Observable<number>;
    /**
     * Adds items in a key
     * @return Total key items count
     */
    addItems(key: string, items: T[]): Observable<number>;
    get(key: string): Observable<T[]>;
    mget(keys: string[]): Observable<PlainObject<T[]>>
    /**
     * Deletes some items from a key
     * @return Total remained items for the key
     */
    deleteItems(key: string, items: T[]): Observable<number>;
    /**
     * Deletes a key
     * @return Total deleted items for the key
     */
    delete(key: string): Observable<number>;
}