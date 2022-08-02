import isEqual from 'lodash.isequal'

import { ICacheValue } from '../LRU.interface';


export interface IObjectCompareLRUCache {
    readonly size: number;
}

// TODO: add timer to reset cache when unused xx times
export class ObjectCompareLRUCache<K extends Record<string, unknown>, V> implements IObjectCompareLRUCache {

    public size: number;

    private _cache: ICacheValue<K, V>[];
    public get cache(): ICacheValue<K, V>[] {
        return this._cache;
    }
    public set cache(v: ICacheValue<K, V>[]) {
        this._cache = v;
    }

    /**
     *
     */
    constructor(params: IObjectCompareLRUCache) {

        this.size = params.size;
        this.cache = [];
    }

    find(key: K) {

        return this.cache.find((a) => isEqual(a.key, key));

    }

    findIndex(key: K) {

        return this.cache.findIndex((a) => isEqual(a.key, key));

    }

    get(key: K) {

        const itemIndex = this.findIndex(key)

        const item = { ...(this.cache[itemIndex]) || {} } as ICacheValue<K, V>;

        if (itemIndex !== -1) {

            // refresh
            this.cache.splice(this.findIndex(key))

            this.cache.unshift(item);
        }

        return item?.value;
    }

    set(key: K, value: V) {

        const item = this.find(key);

        // refresh 
        if (item) this.cache.splice(this.cache.indexOf(item as ICacheValue<K, V>), 1)
        // evict oldest
        else if (this.cache.length === this.size) this.cache.splice(-1);

        this.cache.unshift({ key, value });
    }



}
