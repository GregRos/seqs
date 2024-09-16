import { Doddle, doddle, type DoddleAsync } from "@lib"
import { declare, type, type_of } from "declare-it"
import { lazies } from "./lazies.helper"

const callbacks = {
    sync() {
        return jest.fn(() => {})
    },
    async() {
        return jest.fn(async () => {})
    },
    mixed() {
        return jest.fn(() => null! as Promise<void> | void)
    },
    lazy_sync() {
        return jest.fn(() => doddle(() => {}))
    },
    lazy_async() {
        return jest.fn(() => doddle(async () => {}))
    },
    lazy_mixed() {
        return jest.fn(() => doddle(() => null! as Promise<void> | void))
    }
}

{
    const myCallback = callbacks.sync()
    const myLazy = lazies.sync().each(myCallback)
    declare.it("sync.each(sync) = sync", expect => {
        expect(type_of(myLazy)).to_equal(type<Doddle<1>>)
    })
    it("sync.each(sync) = sync", () => {
        expect(myLazy.pull()).toBe(1)
        expect(myLazy.pull()).toBe(1)
        expect(myCallback).toHaveBeenCalledWith(1)
        expect(myCallback).toHaveBeenCalledTimes(1)
        expect(myCallback).toHaveBeenCalledTimes(1)
    })
    {
        const myCallback = callbacks.lazy_sync()
        const myLazy = lazies.sync().each(myCallback)
        declare.it("sync.each(lazy sync) = sync", expect => {
            expect(type_of(myLazy)).to_equal(type<Doddle<1>>)
        })
        it("sync.each(lazy sync) = sync", () => {
            expect(myLazy.pull()).toBe(1)
            expect(myLazy.pull()).toBe(1)
        })
    }
}
{
    const myCallback = callbacks.async()
    const myLazy = lazies.sync().each(myCallback)
    declare.it("sync.each(async) = async", expect => {
        expect(type_of(myLazy)).to_equal(type<DoddleAsync<1>>)
    })
    it("sync.each(async) = async", async () => {
        await expect(myLazy.pull()).resolves.toBe(1)
        await expect(myLazy.pull()).resolves.toBe(1)
        expect(myCallback).toHaveBeenCalledWith(1)
        expect(myCallback).toHaveBeenCalledTimes(1)
        expect(myCallback).toHaveBeenCalledTimes(1)
    })
    {
        const myCallback = callbacks.lazy_async()
        const myLazy = doddle(() => 1).each(myCallback)
        declare.it("sync.each(lazy async) = async", expect => {
            expect(type_of(myLazy)).to_equal(type<DoddleAsync<number>>)
        })
        it("sync.each(lazy async) = async", async () => {
            await expect(myLazy.pull()).resolves.toBe(1)
            await expect(myLazy.pull()).resolves.toBe(1)
        })
    }
}
{
    const myCallback = callbacks.mixed()
    const myLazy = lazies.sync().each(myCallback)
    declare.it("sync.each(mixed) = mixed", expect => {
        expect(type_of(myLazy)).to_equal(type<Doddle<1 | Promise<1>>>)
    })

    {
        const myCallback = callbacks.lazy_mixed()
        const myLazy = lazies.sync().each(myCallback)
        declare.it("sync.each(lazy mixed) = mixed", expect => {
            expect(type_of(myLazy)).to_equal(type<Doddle<1 | Promise<1>>>)
        })
    }
}
{
    const myCallback = callbacks.sync()
    const myLazy = doddle(async () => 1).each(myCallback)
    declare.it("async.each(sync) = async", expect => {
        expect(type_of(myLazy)).to_equal(type<DoddleAsync<number>>)
    })
    it("async.each(sync) = async", async () => {
        await expect(myLazy.pull()).resolves.toBe(1)
        await expect(myLazy.pull()).resolves.toBe(1)
        expect(myCallback).toHaveBeenCalledWith(1)
        expect(myCallback).toHaveBeenCalledTimes(1)
        expect(myCallback).toHaveBeenCalledTimes(1)
    })
    {
        const myCallback = callbacks.lazy_sync()
        const myLazy = doddle(async () => 1).each(myCallback)
        declare.it("async.each(lazy sync) = async", expect => {
            expect(type_of(myLazy)).to_equal(type<DoddleAsync<number>>)
        })
        it("async.each(lazy sync) = async", async () => {
            await expect(myLazy.pull()).resolves.toBe(1)
            await expect(myLazy.pull()).resolves.toBe(1)
        })
    }
}
{
    const myCallback = callbacks.async()
    const myLazy = doddle(async () => 1).each(myCallback)
    declare.it("async.each(async) = async", expect => {
        expect(type_of(myLazy)).to_equal(type<DoddleAsync<number>>)
    })

    it("async.each(async) = async", async () => {
        await expect(myLazy.pull()).resolves.toBe(1)
        await expect(myLazy.pull()).resolves.toBe(1)
        expect(myCallback).toHaveBeenCalledWith(1)
        expect(myCallback).toHaveBeenCalledTimes(1)
        expect(myCallback).toHaveBeenCalledTimes(1)
    })
    {
        const myCallback = callbacks.lazy_async()
        const myLazy = doddle(async () => 1).each(myCallback)
        declare.it("async.each(lazy async) = async", expect => {
            expect(type_of(myLazy)).to_equal(type<DoddleAsync<number>>)
        })
        it("async.each(lazy async) = async", async () => {
            await expect(myLazy.pull()).resolves.toBe(1)
            await expect(myLazy.pull()).resolves.toBe(1)
        })
    }
}
{
    const myCallback = callbacks.mixed()
    const myLazy = doddle(async () => 1).each(myCallback)
    declare.it("async.each(mixed) = async", expect => {
        expect(type_of(myLazy)).to_equal(type<DoddleAsync<number>>)
    })

    {
        const myCallback = callbacks.lazy_mixed()
        const myLazy = doddle(async () => 1).each(myCallback)
        declare.it("async.each(lazy mixed) = async", expect => {
            expect(type_of(myLazy)).to_equal(type<DoddleAsync<number>>)
        })
    }
}
{
    const myCallback = callbacks.sync()
    const myLazy = lazies.mixed().each(myCallback)
    declare.it("mixed.each(sync) = mixed", expect => {
        expect(type_of(myLazy)).to_equal(type<Doddle<1 | Promise<1>>>)
    })

    {
        const myCallback = callbacks.lazy_sync()
        const myLazy = lazies.mixed().each(myCallback)
        declare.it("mixed.each(lazy sync) = mixed", expect => {
            expect(type_of(myLazy)).to_equal(type<Doddle<1 | Promise<1>>>)
        })
    }
}
{
    const myCallback = callbacks.async()
    const myLazy = lazies.mixed().each(myCallback)
    declare.it("mixed.each(async) = asynb", expect => {
        expect(type_of(myLazy)).to_equal(type<DoddleAsync<1>>)
    })

    {
        const myCallback = callbacks.lazy_async()
        const myLazy = lazies.mixed().each(myCallback)
        declare.it("mixed.each(lazy async) = async", expect => {
            expect(type_of(myLazy)).to_equal(type<DoddleAsync<1>>)
        })
    }
}
