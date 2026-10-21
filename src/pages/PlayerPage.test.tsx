import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as client from "../api/client";
import PlayerPage from "./PlayerPage";

// Replaces every function in the API client with a controllable fake, so
// these tests never touch the network.
vi.mock("../api/client");

// Renders the page at a given URL, with the same route the app uses.
function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/players/:username" element={<PlayerPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("PlayerPage", () => {
  beforeEach(() => {
    // RecentGames also loads data, so it needs a fake response in these tests.
    vi.mocked(client.getPlayerGames).mockResolvedValue([]);
  });
  
  it("shows a player's record", async () => {
    vi.mocked(client.getPlayer).mockResolvedValue({
      username: "EricRosen",
      games: 10,
      wins: 6,
      losses: 3,
      draws: 1,
      top_openings: [{ opening: "London System", games: 4 }],
    });

    renderAt("/players/EricRosen");

    expect(
      await screen.findByRole("heading", { name: "EricRosen" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("10 games: 6 wins, 3 losses, 1 draws"),
    ).toBeInTheDocument();
    expect(screen.getByText("London System: 4 games")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown player", async () => {
    vi.mocked(client.getPlayer).mockRejectedValue(new Error("Not found"));

    renderAt("/players/nobody");

    expect(
      await screen.findByText('No player named "nobody".'),
    ).toBeInTheDocument();
  });
});