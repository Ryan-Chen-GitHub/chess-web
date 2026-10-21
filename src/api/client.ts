import type { OpeningCount, OpeningStats, PlayerRecord, GameDetail, GameSummary } from "./types";

// The base URL can be overridden with VITE_API_URL at build time.
const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

// Fetches a path from the API and parses the JSON as type T. Non-2xx
// responses (such as a 404) become thrown errors.
async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Not found");
    }
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }
  return (await response.json()) as T;
}

export function getOpenings(limit = 10): Promise<OpeningCount[]> {
  return getJson<OpeningCount[]>(`/openings?limit=${limit}`);
}

export function getOpeningStats(eco: string): Promise<OpeningStats> {
  return getJson<OpeningStats>(`/openings/${encodeURIComponent(eco)}/stats`);
}

export function getPlayer(username: string): Promise<PlayerRecord> {
  return getJson<PlayerRecord>(`/players/${encodeURIComponent(username)}`);
}

// Fetches one game and its moves by Lichess ID.
export function getGame(lichessId: string): Promise<GameDetail> {
  return getJson<GameDetail>(`/games/${encodeURIComponent(lichessId)}`);
}

// Fetches a player's most recent games, newest first.
export function getPlayerGames(
  username: string,
  limit = 20,
): Promise<GameSummary[]> {
  return getJson<GameSummary[]>(
    `/players/${encodeURIComponent(username)}/games?limit=${limit}`,
  );
}