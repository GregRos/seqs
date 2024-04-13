import { lazy } from "./ctor";
import {
    LazyLike,
    LazyStage,
    LazyInitializer,
    Pulled,
    isLazyLike,
    isThenable,
    getClassName,
    LazyAsync,
    PulledAwaited
} from "./types";

export const methodName = Symbol("methodName");
export const ownerInstance = Symbol("ownerInstance");
/**
 * Implements a lazily initialized value.
 */
export class Lazy<T> implements LazyLike<T> {
    private _cached?: any;
    stage: LazyStage = "pending";
    private _desc = "<pending>";
    private _init?: LazyInitializer<T>;
    get isReady() {
        return this.stage === "ready";
    }

    /**
     * Creates a new Lazy value backed by the given initializer function.
     * @param initializer The function that will be called to construct the value.
     */
    constructor(initializer: LazyInitializer<T>) {
        this._init = initializer;

        const anyMe = this as any;
        for (const key of ["pull", "map", "each"]) {
            anyMe[key] = anyMe[key].bind(this);
            anyMe[key][ownerInstance] = this;
            anyMe[key][methodName] = key;
        }
    }

    static create<T>(initializer: () => T | Lazy<T>): Lazy<T> {
        const asAny = initializer as any;
        if (asAny[ownerInstance] && asAny[methodName] === "pull") {
            return asAny[ownerInstance];
        }
        return new Lazy(initializer) as any;
    }

    /**
     * Returns a short description of the Lazy value's state.
     */
    toString() {
        return this._desc;
    }

    pull(): Pulled<T> {
        if (this.stage === "failed") {
            // Correct way to return the error
            throw this._cached;
        }
        if (this.stage === "ready") {
            return this._cached!;
        }
        let resource: any;
        try {
            const result = this._init!();
            resource = isLazyLike(result) ? result.pull() : result;
        } catch (e) {
            this._cached = e;
            this._desc = "lazy <failed>";
            this.stage = "failed";
            throw e;
        }
        // No need to keep holding a reference to the constructor.
        this._init = undefined;

        if (isThenable(resource)) {
            this._desc = "lazy async <resolving>";
            resource = resource.then(
                value => {
                    if (isLazyLike(value)) {
                        value = value.pull();
                    }
                    this._desc = `lazy async ${getClassName(value)}`;
                    return value;
                },
                error => {
                    this._desc = `lazy async <failed>`;
                    throw error;
                }
            );
        } else {
            this._desc = `lazy ${getClassName(resource)}`;
        }
        this._cached = resource;
        this.stage = "ready";

        return resource;
    }

    get [Symbol.toStringTag]() {
        return this._desc;
    }

    map<S, R>(
        this: LazyAsync<S>,
        projection: (value: PulledAwaited<S>) => Promise<LazyAsync<R>>
    ): LazyAsync<R>;
    map<S, Y>(
        this: LazyAsync<S>,
        projection: (value: PulledAwaited<S>) => Promise<LazyAsync<Y>>
    ): LazyAsync<Y>;
    map<S, X>(
        this: LazyAsync<S>,
        projection: (value: PulledAwaited<S>) => Promise<Lazy<X>>
    ): LazyAsync<X>;
    map<S, X>(
        this: LazyAsync<S>,
        projection: (value: PulledAwaited<S>) => Promise<X>
    ): LazyAsync<X>;
    map<S, X>(
        this: LazyAsync<S>,
        projection: (value: PulledAwaited<S>) => LazyAsync<X>
    ): LazyAsync<X>;
    map<S, R>(
        this: LazyAsync<S>,
        f: (value: PulledAwaited<S>) => Lazy<R>
    ): LazyAsync<R>;
    map<S, R>(
        this: LazyAsync<S>,
        f: (value: PulledAwaited<S>) => R
    ): LazyAsync<R>;
    map<Y>(
        projection: (value: PulledAwaited<T>) => Promise<LazyAsync<Y>>
    ): LazyAsync<Y>;
    map<X>(
        projection: (value: PulledAwaited<T>) => Promise<Lazy<X>>
    ): LazyAsync<X>;
    map<X>(projection: (value: PulledAwaited<T>) => Promise<X>): LazyAsync<X>;
    map<R>(projection: (value: PulledAwaited<T>) => Lazy<R>): Lazy<R>;
    map<R>(projection: (value: PulledAwaited<T>) => R): Lazy<R>;

    map(this: Lazy<any>, projection: (a: any) => any): any {
        return lazy(() => {
            const pulled = this.pull();
            if (isThenable(pulled)) {
                return pulled.then(projection);
            }
            return projection(pulled);
        });
    }

    each<S>(
        this: LazyAsync<S>,
        handler: (
            value: S
        ) =>
            | any
            | Lazy<any>
            | Promise<any>
            | Promise<LazyAsync<any>>
            | LazyAsync<any>
    ): LazyAsync<S>;
    each<T>(
        this: Lazy<T>,
        handler: (value: PulledAwaited<T>) => Promise<any> | LazyAsync<any>
    ): LazyAsync<T>;
    each<T>(
        this: Lazy<T>,
        handler: (value: PulledAwaited<T>) => Lazy<any>
    ): Lazy<T>;
    each<T>(this: Lazy<T>, handler: (value: PulledAwaited<T>) => any): Lazy<T>;

    /**
     * Returns a new Lazy, **WAITING**, that will execute **THIS** and invoke the given handler
     * on the result. It will wait for the handler to finish before producing the same value.
     * @param handler The handler to invoke on the value of **THIS**.
     */
    each<T>(this: LazyAsync<T>, handler: (value: any) => any): any {
        return this.map(x => {
            const result = handler(x);
            return lazy(() => {
                return result;
            }).map(() => x);
        });
    }

    zip<Others extends readonly [Lazy<unknown>, ...Lazy<unknown>[]]>(
        ...others: Others
    ): LazyAsync<any> extends [this, ...Others][number]
        ? LazyAsync<
              [
                  PulledAwaited<T>,
                  ...{
                      [K in keyof Others]: PulledAwaited<Others[K]>;
                  }
              ]
          >
        : Lazy<
              [
                  Pulled<T>,
                  ...{
                      [K in keyof Others]: Pulled<Others[K]>;
                  }
              ]
          >;

    zip(...others: Lazy<any>[]): Lazy<any> {
        return lazy(() => {
            const values = [this, ...others].map(x => x.pull());
            if (values.some(isThenable)) {
                return Promise.all(values);
            }
            return values;
        });
    }
}
