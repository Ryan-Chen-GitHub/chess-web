import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PieceSet } from "../pieces/types";
import Board from "./Board";

// A stand-in piece set that draws a marker, so the test can count pieces
// without depending on the actual artwork.
const testSet: PieceSet = {
    id: "test",
    name: "Test",
    render: () => <circle data-testid="piece" r="1" />, 
};

describe("Board", () => {
    it("draws one piece per entry using the given piece set", () => {
        render(
            <Board
                pieceSet={testSet}
                pieces={[
                    { square: "e4", type: "p", color: "w" },
                    { square: "e5", type: "p", color: "b" },
                ]}
            />,
        );

        expect(screen.getAllByTestId("piece")).toHaveLength(2);
        expect(screen.getByRole("img", { name: "Chess board" })).toBeInTheDocument();
    });
});