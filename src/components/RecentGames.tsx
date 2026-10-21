import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPlayerGames } from "../api/client";
import type { GameSummary } from "../api/types";

// The outcome of one lookup, tagged with the username it was requested for.
interface GamesLookup {
    username: string;
    games: GameSummary[] | null;
    error: string | null;
}

// Text shown in the colored badge for each outcome.
const OUTCOME_LABELS = {
    win: "Win",
    loss: "Loss",
    draw: "Draw",
    unknown: "?",
} as const;

// A list of player's recent games, each linking to its replay page.
export default function RecentGames({ username }: { username: string }) {
    const [result, setResult] = useState<GamesLookup | null>(null);

    /* Fetches whenever the username changes. State is only set in the
    callbacks, and "cancelled" stops an outdated response from overwriting 
    a newer one. */
    useEffect(() => {
        let cancelled = false;
        getPlayerGames(username)
            .then((games) => {
                if (!cancelled) setResult({ username, games, error: null});
            })
            .catch((err: Error) => {
                if (!cancelled) setResult({ username, games: null, error: err.message });
            });
        return () => {
            cancelled = true;
        };
    }, [username]);

    // A stored result only counts if it belongs to the current username.
    const current = result?.username === username ? result : null;

    if (!current) return <p className="muted">Loading games...</p>;
    if (current.error || !current.games) {
        return <p>Could not load games: {current.error}</p>;
    }
    if (current.games.length === 0) return <p>No games found.</p>;

    return (
        <div>
            <h3>Recent games</h3>
            <ul className="game-list">
                {current.games.map((g) => (
                    <li key={g.lichess_id} className={`game-${g.outcome}`}>
                        <Link to={`/games/${g.lichess_id}`}>
                            <span className="badge">{OUTCOME_LABELS[g.outcome]}</span>
                            <span>
                                as {g.player_color} vs {g.opponent}
                            </span>
                            <span className="muted">
                                {g.opening ?? "Unknown opening"}
                                {/* The first 10 characters are the date (YYYY-MM-DD). Slicing
                                avoids timezone shifts from parsing it as a Date.*/}
                                {g.played_at ? ` · ${g.played_at.slice(0, 10)}` : ""}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}