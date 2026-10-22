import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi} from "vitest";

import * as client from "../api/client";
import GamePage from "./GamePage";

// Replaces the API client with a controllable fake, so no network is used.
vi.mock("../api/client");

// Renders the page at a game URL, with the same route the app uses.
function renderGame() {
    render(
        <MemoryRouter initialEntries={["/games/abcd1234"]}>
            <Routes>
                <Route path="/games/:lichessId" element={<GamePage />} />
            </Routes>
        </MemoryRouter>
    );
}

// A two-move game for the tests below.
const game = {
    lichess_id: "abcd1234",
    white: "alice",
    black: "bob",
    white_elo: 1500,
    black_elo: 1480,
    result: "1-0",
    eco: "C20",
    opening: "King's Pawn Game",
    played_at: null,
    moves: [
        { ply: 1, san: "e4", uci: "e2e4" },
        { ply: 2, san: "e5", uci: "e7e5" },
    ],
};

describe("GamePage", () => {
    it("steps through the moves with the arrow keys", async () => {
        vi.mocked(client.getGame).mockResolvedValue(game);

        renderGame();

        expect(await screen.findByText("Move 0 of 2")).toBeInTheDocument();

        fireEvent.keyDown(window, { key: "ArrowRight" });
        expect(screen.getByText("Move 1 of 2")).toBeInTheDocument();

        fireEvent.keyDown(window, { key: "ArrowLeft" });
        expect(screen.getByText("Move 0 of 2")).toBeInTheDocument();
    });

    it("jumps to a move when it is clicked in the move list", async () => {
        vi.mocked(client.getGame).mockResolvedValue(game);

        renderGame();
        fireEvent.click(await screen.findByRole("button", { name: "e5" }));

        expect(screen.getByText("Move 2 of 2")).toBeInTheDocument();
    });
});