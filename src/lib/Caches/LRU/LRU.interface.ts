export interface ILRUCacheParams {
    // max storage size
    readonly size: number;
}

export interface ILRUCache<K, V> {
    readonly cache: Map<K, V>;
}

export interface ICacheValue<K, V> {
    key: K;
    value: V;
}
