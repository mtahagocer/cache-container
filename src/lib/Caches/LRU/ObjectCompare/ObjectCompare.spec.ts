import test from 'ava';

import ObjectCompareLRUApiCache from './ApiCache';
import { ObjectCompareLRUCache } from './ObjectCompareLRUCache';

type IResponse = number[];


test('push', (t) => {

    const cache = new ObjectCompareLRUCache<Record<string, unknown>, IResponse>({
        size: 50
    })

    const example = {
        a: 5,
        b: "",
        c: {
            a: 5
        }
    }

    const example2 = {
        a: 6,
        b: "",
        c: {
            a: 7
        }
    }

    const example3 = {
        a: 8,
        b: "",
        c: {
            a: 9
        }
    }

    cache.set(example, [1, 1, 1])
    cache.set(example2, [2, 2, 2])
    cache.set(example3, [3, 3, 3])

    t.deepEqual(cache.get(example), [1, 1, 1])
    t.deepEqual(cache.get(example2), [2, 2, 2])
    t.deepEqual(cache.get(example3), [3, 3, 3])

});


test('bulk', (t) => {

    const cache = new ObjectCompareLRUCache<Record<string, unknown>, IResponse>({
        size: 4999
    })


    Array.from(new Array(5000)).forEach((_, i) => cache.set({
        a: i + 1,
        b: `${i + 1}`,
        c: {
            a: i + 1
        }
    },
        [i + 1, i + 1]
    ))

    t.deepEqual(cache.get({
        a: 5000,
        b: `${5000}`,
        c: {
            a: 5000
        }
    }), [5000, 5000])

})

test('api usage', async (t) => {

    interface IParams extends Record<string, unknown> {
        page: number;
    }

    const apiRequest = (params: IParams) => new Promise((resolve) => resolve(params.page)) as Promise<number>

    const cachedApiRequest = ObjectCompareLRUApiCache<IParams, number>({
        apiRequest,
        cacheConfig: {
            size: 2
        }
    })

    await cachedApiRequest({ page: 1 })
    await cachedApiRequest({ page: 2 })
    await cachedApiRequest({ page: 3 })

    cachedApiRequest.cache.size = 3

    await cachedApiRequest({ page: 4 })

    cachedApiRequest.cache.size = 2

    await cachedApiRequest({ page: 5 })

    console.log("logged cache", cachedApiRequest.cache)

    t.true(true)
})