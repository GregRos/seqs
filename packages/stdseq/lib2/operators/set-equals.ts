import { type ASeqLikeInput, type SeqLikeInput } from "../f-types/index"
import { lazyFromOperator } from "../from/operator"
import type { Lazy, LazyAsync } from "../lazy"
import { aseq } from "../seq/aseq.ctor"
import { seq } from "../seq/seq.ctor"

export function sync<T extends S, S>(this: Iterable<T>, _other: SeqLikeInput<S>): Lazy<boolean>
export function sync<T, S extends T>(this: Iterable<T>, _other: SeqLikeInput<S>): Lazy<boolean>
export function sync<T, S extends T>(this: Iterable<T>, _other: SeqLikeInput<S>) {
    const other = seq(_other)
    return lazyFromOperator("setEquals", this, input => {
        const set = new Set(other) as Set<any>
        for (const element of input) {
            if (!set.delete(element)) {
                return false
            }
        }
        return set.size === 0
    })
}

export function async<T, S extends T>(
    this: AsyncIterable<T>,
    _other: ASeqLikeInput<S>
): LazyAsync<boolean>
export function async<T extends S, S>(
    this: AsyncIterable<T>,
    _other: ASeqLikeInput<S>
): LazyAsync<boolean>
export function async<T, S>(this: AsyncIterable<T>, _other: ASeqLikeInput<S>) {
    const other = aseq(_other)
    return lazyFromOperator("setEquals", this, async input => {
        const set = new Set<T>() as Set<any>
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
