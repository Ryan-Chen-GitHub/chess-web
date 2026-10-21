import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPlayer } from "../api/client";
import type { PlayerRecord } from "../api/types";

import RecentGames from "../components/RecentGames";

// The outcome of one lookup, tagged with the username it was requested for.
interface LookupResult {
  username: string;
  player: PlayerRecord | null;
  error: string | null;
}

export default function PlayerPage() {
  // The username comes from the URL: /players/EricRosen
  const { username } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);

  // Fetches whenever the username in the URL changes. State is only set in
  // the callbacks below, and the "cancelled" flag stops a slow, outdated
  // response from overwriting a newer one.
  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    getPlayer(username)
      .then((player) => {
        if (!cancelled) setResult({ username, player, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setResult({ username, player: null, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  // Derived during render: a stored result only counts if it belongs to the
  // username currently in the URL, and "loading" means a lookup is pending.
  const current = result?.username === username ? result : null;
  const player = current?.player ?? null;
  const error = current?.error ?? null;
  const loading = Boolean(username) && current === null;

  // Moves to the player's own URL when the form is submitted.
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const name = input.trim();
    if (name) navigate(`/players/${encodeURIComponent(name)}`);
  }

  return (
    <section>
      <h1>Player lookup</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Lichess username"
          aria-label="Lichess username"
        />
        <button type="submit">Look up</button>
      </form>

      {loading && <p>Loading...</p>}
      {error === "Not found" && <p>No player named "{username}".</p>}
      {error && error !== "Not found" && <p>Something went wrong: {error}</p>}

      {player && !loading && (
        <div>
          <h2>{player.username}</h2>
          <p>
            {player.games} games: {player.wins} wins, {player.losses} losses,{" "}
            {player.draws} draws
          </p>
          <h3>Top openings</h3>
          <ol>
            {player.top_openings.map((o) => (
              <li key={o.opening}>
                {o.opening}: {o.games} games
              </li>
            ))}
          </ol>
          <RecentGames username={player.username} />
        </div>
      )}
    </section>
  );
}