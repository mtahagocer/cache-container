import {
    IObjectCompareLRUCache,
    ObjectCompareLRUCache,
} from './ObjectCompareLRUCache';

export interface IParams<P extends Record<string, unknown>, R> {
    cacheConfig: IObjectCompareLRUCache;
    apiRequest: ({ ...p }: P) => Promise<R>;
}

export interface IObjectCompareLRUApiCache<
    P extends Record<string, unknown>,
    R
    > {
    (props: P): Promise<R>;
    cache: ObjectCompareLRUCache<P, R>;
}

const ObjectCompareLRUApiCache = <P extends Record<string, unknown>, R>({
    apiRequest,
    cacheConfig,
}: IParams<P, R>): IObjectCompareLRUApiCache<P, R> => {
    const _cache = new ObjectCompareLRUCache<P, R>(cacheConfig);

    const cachedApiRequest = (props: P) =>
        apiRequest(props).then((res) => {
            _cache.set(props, res);

            return res;
        });

    Object.setPrototypeOf(cachedApiRequest, {
        cache: _cache,
    });

    return cachedApiRequest as IObjectCompareLRUApiCache<P, R>;
};

export default ObjectCompareLRUApiCache;
