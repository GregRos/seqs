import { mustBeFunction, mustBeOneOf } from "../../errors/error.js"
import { ASeqOperator, type ASeq } from "../seq/aseq.class.js"
import type { Seq } from "../seq/seq.class.js"
import { SeqOperator } from "../seq/seq.class.js"
export type EachCallStage = "before" | "after" | "both" | undefined
const mustBeStage = mustBeOneOf("before", "after", "both", undefined)
export function sync<T>(
    this: Iterable<T>,
    action: Seq.StageIteratee<T, void>,
    stage: EachCallStage = "before"
) {
    mustBeFunction("action", action)
    mustBeStage("stage", stage)
    stage ??= "before"
    return SeqOperator(this, function* each(input) {
        let index = 0
        for (const element of input) {
            if (stage === "before" || stage === "both") {
                action(element, index, "before")
            }
            yield element
            if (stage === "after" || stage === "both") {
                action(element, index, "after")
            }
            index++
        }
    })
}
export function async<T>(
    this: AsyncIterable<T>,
    action: ASeq.StageIteratee<T, void>,
    stage: EachCallStage = "before"
) {
    mustBeFunction("action", action)
    mustBeStage("stage", stage)
    stage ??= "before"
    return ASeqOperator(this, async function* each(input) {
        let index = 0
        for await (const element of input) {
            if (stage === "before" || stage === "both") {
                await action(element, index, "before")
            }
            yield element
            if (stage === "after" || stage === "both") {
                await action(element, index, "after")
            }
            index++
        }
    })
}
