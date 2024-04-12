import { Seq } from "@lib";
import { seqs } from "../../lib/seq/sync/seqs";
import { expect } from "earl";
it("get at 0", () => {
    const s = seqs.of(1, 2, 3);
    expect(s.at(0).pull()).toEqual(1);
});

it("get at missing index is range error", () => {
    const s = seqs.of(1, 2, 3);
    expect(() => s.at(3)).toThrow(RangeError);
});

it("get at negative index", () => {
    const s = seqs.of(1, 2, 3);
    expect(s.at(-1).pull()).toEqual(3);
});
