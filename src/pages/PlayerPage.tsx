import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPlayer } from "../api/client";
import type { PlayerRecord } from "../api/types";

export default function PlayerPage() {
  // The username comes from the URL: /players/EricRosen
  const { username } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [player, setPlayer] = useState<PlayerRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetches whenever the username in the URL changes. The "cancelled" flag
  // stops a slow, outdated response from overwriting a newer one.
  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getPlayer(username)
      .then((record) => {
        if (!cancelled) setPlayer(record);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setPlayer(null);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

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
        </div>
      )}
    </section>
  );
}