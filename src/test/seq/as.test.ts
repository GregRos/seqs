import { Seq, seq } from "@lib";
import { expect } from "earl";

it("should do nothing", () => {
    const s = seq();
    expect(s.as<number>()).toEqual(s);
    s satisfies Seq<never>;
    s.as<number>() satisfies Seq<number>;
    // @ts-expect-error
    s.as<number>() satisfies Seq<string>;
});
