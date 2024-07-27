import { declare, type, type_of } from "declare-it"
import type { Lazy, LazyAsync } from "stdlazy"
import type { ASeq } from "../seq/aseq.class"
import { aseq } from "../seq/aseq.ctor"
import type { Seq } from "../seq/seq.class"
import { seq } from "../seq/seq.ctor"

// test sync `every` function
describe("sync", () => {
    const f = seq
    type SType<T> = Seq<T>
    declare.test("should type as Lazy<boolean>", expect => {
        expect(type_of(f([1, 2, 3]).every(() => true))).to_equal(type<Lazy<boolean>>)
    })
    it("returns true for empty", () => {
        const s = f([]).every(() => false)
        expect(s.pull()).toEqual(true)
    })

    it("returns false for no matches", () => {
        const s = f([1, 2, 3]).every(() => false)
        expect(s.pull()).toEqual(false)
    })

    it("returns true for all matches", () => {
        const s = f([1, 2, 3]).every(() => true)
        expect(s.pull()).toEqual(true)
    })
    it("has no side-effects before pull", () => {
        const fn = jest.fn(function* () {})
        const s = f(fn)
        const lazy = s.every(() => true)
        expect(fn).not.toHaveBeenCalled()
        lazy.pull()
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it("pulls as many as needed when false", () => {
        const sq = jest.fn(function* () {
            yield 1
            expect(false).toBe(true)
        })
        const tkw = f(sq).every(() => false)
        expect(sq).not.toHaveBeenCalled()
        tkw.pull()
        expect(sq).toHaveBeenCalledTimes(1)
    })

    it("calls predicate as many times as needed when true", () => {
        const fn = jest.fn(() => true)
        const s = f([1, 2, 3]).every(fn)
        s.pull()
        expect(fn).toHaveBeenCalledTimes(3)
    })

    it("calls predicate as many times as needed when false", () => {
        const fn = jest.fn(() => false)
        const s = f([1, 2, 3]).every(fn)
        s.pull()
        expect(fn).toHaveBeenCalledTimes(1)
    })
})

// test async `every` function
describe("async", () => {
    const f = aseq
    type SType<T> = ASeq<T>
    declare.test("should type as Lazy<boolean>", expect => {
        expect(type_of(f([1, 2, 3]).every(() => true))).to_equal(type<LazyAsync<boolean>>)
    })
    it("returns true for empty", async () => {
        const s = f([]).every(() => false)
        expect(await s.pull()).toEqual(true)
    })

    it("returns false for no matches", async () => {
        const s = f([1, 2, 3]).every(() => false)
        expect(await s.pull()).toEqual(false)
    })

    it("returns true for all matches", async () => {
        const s = f([1, 2, 3]).every(() => true)
        expect(await s.pull()).toEqual(true)
    })
    it("has no side-effects before pull", async () => {
        const fn = jest.fn(async function* () {})
        const s = f(fn)
        const lazy = s.every(() => true)
        expect(fn).not.toHaveBeenCalled()
        await lazy.pull()
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it("pulls as many as needed when false", async () => {
        const sq = jest.fn(async function* () {
            yield 1
            expect(false).toBe(true)
        })
        const tkw = f(sq).every(() => false)
        expect(sq).not.toHaveBeenCalled()
        await tkw.pull()
        expect(sq).toHaveBeenCalledTimes(1)
    })

    it("calls predicate as many times as needed when true", async () => {
        const fn = jest.fn(() => true)
        const s = f([1, 2, 3]).every(fn)
        await s.pull()
        expect(fn).toHaveBeenCalledTimes(3)
    })

    it("calls predicate as many times as needed when false", async () => {
        const fn = jest.fn(() => false)
        const s = f([1, 2, 3]).every(fn)
        await s.pull()
        expect(fn).toHaveBeenCalledTimes(1)
    })
})
