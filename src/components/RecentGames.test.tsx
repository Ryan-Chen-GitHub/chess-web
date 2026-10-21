import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import * as client from "../api/client";
import RecentGames from "./RecentGames";

// Replaces the API client with controllable fakes, so no network is used.
vi.mock("../api/client");

// Links need a router around them, so every render is wrapped in one.
function renderGames() {
    render(
        <MemoryRouter>
            <RecentGames username="alice" />
        </MemoryRouter>,
    );
}

describe("RecentGames", () => {
    it("lists games with links to their replay pages", async () => {
        vi.mocked(client.getPlayerGames).mockResolvedValue([
            {
                lichess_id: "abcd1234",
                opponent: "bob",
                player_color: "white",
                outcome: "win",
                opening: "London System",
                played_at: "2024-01-15T18:30:00",
            },
        ]);

        renderGames();
        
        const link = await screen.findByRole("link", { name: /bob/ });
        expect(link).toHaveAttribute("href", "/games/abcd1234");
        expect(screen.getByText("Win")).toBeInTheDocument();
    });

    it("shows a message when there are no games", async () => {
        vi.mocked(client.getPlayerGames).mockResolvedValue([]);

        renderGames();

        expect(await screen.findByText("No games found.")).toBeInTheDocument();
    });
});