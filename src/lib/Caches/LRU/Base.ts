import { ILRUCache, ILRUCacheParams } from "./LRU.interface";

export class KeyValueLRUCache<K, V> implements ILRUCache<K, V> {
    protected readonly size: number;

    private _cache: Map<K, V>;

    public get cache(): Map<K, V> {
        return this._cache;
    }

    protected set cache(v: Map<K, V>) {
        this._cache = v;
    }

    /**
     *
     */
    constructor(params: ILRUCacheParams) {

        this.size = params.size;

        this._cache = new Map<K, V>();

    }

    get(key: K) {

        const item = this.cache.get(key);

        if (item) {
            // refresh key
            this.cache.delete(key);
            this.cache.set(key, item);
        }

        return this.cache.get(key);
    }

    set(key: K, value: V) {
        // refresh key
        if (this.cache.has(key)) this.cache.delete(key);
        // evict oldest
        else if (this.cache.size == this.size) this.cache.delete(this.first());

        this.cache.set(key, value);
    }

    first() {
        return this.cache.keys().next().value;
    }

    clear = this.cache.clear;

    delete = this.cache.delete;

}