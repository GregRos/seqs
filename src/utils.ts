import { Lazy } from "./lazy/index.js"

export function _iter<T>(input: Iterable<T>): Iterator<T> {
    return input[Symbol.iterator]()
}
export function _aiter<T>(input: AsyncIterable<T>): AsyncIterator<T> {
    return input[Symbol.asyncIterator]()
}

export function isObject<T>(value: T): value is T & {} {
    return typeof value === "object" && value != null
}

export function isFunction(value: any): boolean {
    return typeof value === "function"
}

export function isNum(value: any): value is number {
    return typeof value === "number"
}

export function isIterable<T>(value: any): value is Iterable<T> {
    return isObject(value) && isFunction(value[Symbol.iterator])
}
export function isAnyIterable(value: any): value is Iterable<any> {
    return isIterable(value) || isAsyncIterable(value)
}
const orderedStages = [undefined, "before", "after", "both"] as const
export const parseStage = (value: (typeof orderedStages)[number]): Stage => {
    return orderedStages.indexOf(value)
}
export const isStage = (value: any) => {
    const parsed = parseStage(value)
    return parsed > 0 && parsed <= 3
}

export const isNumber = (v: number) => +v === v
export const isInt = Number.isSafeInteger
export const isIntOrInfinity = (v: number) => isInt(v) || v === Infinity
export const isNatOrInfinity = (v: number) => isIntOrInfinity(v) && v >= 0
export const isBool = (value: boolean) => !!value === value
export const isNotNullish = (value: any) => value != null
export const isPair = (value: any) => Array.isArray(value) && value.length === 2
export const isPosInt = (value: number) => isInt(value) && value > 0
export const isError = (value: any) => value instanceof Error
export const isSymbol = (value: any) => typeof value === "symbol"
export const enum Stage {
    Before = 1,
    After = 2,
    Both = 3
}

export function isAsyncIterable<T>(value: any): value is AsyncIterable<T> {
    return isObject(value) && isFunction(value[Symbol.asyncIterator])
}

export function isBigInt(value: any): value is bigint {
    return typeof value === "bigint"
}

export function isString(value: any): value is string {
    return typeof value === "string"
}

export function isNullish(value: any): value is null | undefined {
    return value == null
}

export function isNextable<T>(value: any): value is Iterator<T> | AsyncIterator<T> {
    // Checks if value is an iterator
    return isObject(value) && isFunction(value.next)
}

export function getClassName(something: any) {
    if (!isObject(something)) {
        return typeof something
    }
    if (something === null) {
        return "null"
    }
    const ctorName = something.constructor?.name ?? something?.[Symbol.toStringTag] ?? "Object"
    return ctorName
}

export function getSymbolDescription(symbol: symbol) {
    return `Symbol(${symbol.description})`
}

export function getObjDesc(object: any) {
    if (isIterable(object)) {
        return `iterable ${getClassName(object)}`
    } else if (isAsyncIterable(object)) {
        return `async iterable ${getClassName(object)}`
    } else if (isNextable(object)) {
        return `iterator ${getClassName(object)}`
    } else if (isLazy(object)) {
        return object.toString()
    } else if (isThenable(object)) {
        return `a Promise`
    } else {
        return `object ${getClassName(object)}`
    }
}
export function getValueDesc(object: any) {
    if (isNullish(object)) {
        return `${object}`
    }
    if (isFunction(object)) {
        return `function ${getFunctionName(object) || "<anonymous>"}`
    }
    if (isBigInt(object)) {
        return `${object}n`
    }
    if (isSymbol(object)) {
        return getSymbolDescription(object)
    }
    if (isString(object)) {
        if (object.length > 30) {
            object = object.slice(0, 30) + "⋯"
        }
        return `"${object}"`
    }
    if (isObject(object)) {
        return getObjDesc(object)
    }
    return `${object}`
}

export function getFunctionName(initializer: Function) {
    return initializer.name || null
}

/**
 * Checks if the given value is a thenable.
 *
 * @param what The value to check.
 */
export function isThenable<T = unknown>(what: unknown): what is PromiseLike<T> {
    return isObject(what) && isFunction((what as any).then)
}

export function isLazy(value: any): value is Lazy<any> {
    return isObject(value) && value instanceof Lazy
}

export const isArray = Array.isArray

export function returnKvp(input: any, key: any, value: any) {
    if (isAsyncIterable(input) && isThenable(key)) {
        return key.then(key => ({
            key: key,
            value: value
        })) as Promise<any>
    }
    return {
        key: key,
        value: value
    }
}
export function getThrownError(thrown: unknown) {
    return thrown instanceof Error ? thrown : new Error(String(thrown))
}
export function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}
