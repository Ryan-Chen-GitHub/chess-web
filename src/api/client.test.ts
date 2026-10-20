import { afterEach, describe, expect, it, vi } from "vitest";

import { getOpenings, getPlayer, getGame } from "./client";

// Replaces the browser's fetch with a fake that returns a canned response.
function mockFetch(status: number, body: unknown) {
  const fake = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
  vi.stubGlobal("fetch", fake);
  return fake;
}

afterEach(() => vi.unstubAllGlobals());

describe("api client", () => {
  it("requests openings with the given limit", async () => {
    const fake = mockFetch(200, [{ opening: "London System", games: 3 }]);

    const result = await getOpenings(5);

    expect(fake).toHaveBeenCalledWith(
      expect.stringContaining("/openings?limit=5"),
    );
    expect(result).toEqual([{ opening: "London System", games: 3 }]);
  });

  it("turns a 404 into a readable error", async () => {
    mockFetch(404, { detail: "Unknown player nobody" });

    await expect(getPlayer("nobody")).rejects.toThrow("Not found");
  });

  it("escapes special characters in usernames", async () => {
    const fake = mockFetch(200, {});

    await getPlayer("a/b c");

    expect(fake).toHaveBeenCalledWith(
      expect.stringContaining("/players/a%2Fb%20c"),
    );
  });

  it("requests a game by id", async () => {
    const fake = mockFetch(200, { lichess_id: "abcd1234", moves: [] });

    await getGame("abcd1234");

    expect(fake).toHaveBeenCalledWith(
      expect.stringContaining("/games/abcd1234"),
    );
  });
});