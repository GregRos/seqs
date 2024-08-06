import { mustBeFunction } from "../../errors/error.js"
import { ASeqOperator, type ASeq } from "../seq/aseq.class.js"
import { SeqOperator, type Seq } from "../seq/seq.class.js"

export function sync<T>(this: Iterable<T>, projection: Seq.NoIndexIteratee<T, any>): Seq<T> {
    mustBeFunction("projection", projection)
    return SeqOperator(this, function* uniqBy(input) {
        const seen = new Set()
        for (const element of input) {
            const key = projection(element)
            if (!seen.has(key)) {
                seen.add(key)
                yield element
            }
        }
    })
}
export function async<T>(
    this: AsyncIterable<T>,
    projection: ASeq.NoIndexIteratee<T, any>
): ASeq<T> {
    mustBeFunction("projection", projection)
    return ASeqOperator(this, async function* uniqBy(input) {
        const seen = new Set()
        for await (const element of input) {
            const key = await projection(element)
            if (!seen.has(key)) {
                seen.add(key)
                yield element
            }
        }
    })
}
