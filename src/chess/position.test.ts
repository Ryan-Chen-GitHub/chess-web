import { describe, expect, it } from "vitest";

import { positionAfter } from "./position";

describe("positionAfter", () => {
    it("returns the starting position at ply 0", () => {
        const position = positionAfter(["e4", "e5"], 0);

        expect(position.pieces).toHaveLength(32);
        expect(position.lastMove).toBeNull();
    });

    it("moves pieces and reports the last move", () => {
        const position = positionAfter(["e4", "e5"], 2);

        // The white pawn left e2 and now stands on e4.
        expect(position.pieces.find((p) => p.square === "e2")).toBeUndefined();
        expect(position.pieces.find((p) => p.square === "e4")).toMatchObject({
            type: "p",
            color: "w",
        });
        expect(position.lastMove).toEqual({ from: "e7", to: "e5" });
    });

    it("removes captured pieces", () => {
        // Scholar's mate: the queen captures the f7 pawn.
        const sans = ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"];
        const position = positionAfter(sans, sans.length);

        expect(position.pieces).toHaveLength(31);
        expect(position.pieces.find((p) => p.square === "f7")).toMatchObject({
            type: "q",
            color: "w",
        });
    });
});