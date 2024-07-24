import { lazyFromOperator, asyncFromOperator, syncFromOperator } from "../from/operator"
import { Iteratee, AsyncIteratee, type Eq, type SeqLikeInput } from "../f-types/index"
import { mustBeAsyncIterable, mustBeIterable } from "../errors/error"
import { fromAsyncInput, fromSyncInput } from "../from/input"

export function sync<T>(this: Iterable<T>, _other: SeqLikeInput<T>) {
    const other = fromSyncInput(_other)
    return lazyFromOperator("setEquals", this, input => {
        const set = new Set(other)
        for (const element of input) {
            if (!set.delete(element)) {
                return false
            }
        }
        return set.size === 0
    })
}
export function async<T>(this: AsyncIterable<T>, _other: AsyncIterable<T>) {
    const other = fromAsyncInput(_other)
    return lazyFromOperator("setEquals", this, async input => {
        const set = new Set<T>()
        for await (const element of other) {
            set.add(element)
        }
        for await (const element of input) {
            if (!set.delete(element)) {
                return false
            }
        }
        return set.size === 0
    })
}
