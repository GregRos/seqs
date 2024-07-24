import { aseq } from "../aseq"
import { asyncFromOperator, syncFromOperator } from "../from/operator"
import { seq } from "../seq"

export function sync<T>(this: Iterable<T>, length: number) {
    return syncFromOperator("sample", this, function* (input) {
        yield* seq(input).shuffle().take(length)
    })
}

export function async<T>(this: AsyncIterable<T>, length: number) {
    return asyncFromOperator("sample", this, async function* (input) {
        yield* aseq(input).shuffle().take(length)
    })
}
