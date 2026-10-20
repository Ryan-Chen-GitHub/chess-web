import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getGame } from "../api/client";
import type { GameDetail } from "../api/types";
import Board from "../board/Board";
import { positionAfter } from "../chess/position";

// The outcome of one lookup, tagged with the game ID it was requested for.
interface GameLookup {
    id: string;
    game: GameDetail | null;
    error: string | null;
}

// Shows one game's baord with buttons to step through the moves.
function GameViewer({ game }: { game: GameDetail }) {
    // How many half-moves have been played on the board (0 = starting position).
    const [ply, setPly] = useState(0);
    const total = game.moves.length;

    // The moves as plain SAN strings, and the position after `ply` of them.
    const sans = useMemo(() => game.moves.map((m) => m.san), [game]);
    const position = useMemo(() => positionAfter(sans, ply), [sans, ply]);

    // the BUTTONS!
    return (
        <section>
            <h1>
                {game.white} vs {game.black}
            </h1>
            <p>
                {game.opening ?? "Unknown opening"} · Result {game.result}
            </p>
            <Board pieces={position.pieces} lastMove={position.lastMove} />
            <div className="controls">
                <button onClick={() => setPly(0)} disabled={ply === 0}>
                    Start
                </button>
                <button onClick={() => setPly(ply - 1)} disabled={ply === 0}>
                    Back
                </button>
                <button onClick={() => setPly(ply + 1)} disabled={ply === total}>
                    Next
                </button>
                <button onClick={() => setPly(total)} disabled={ply === total}>
                    End
                </button>
            </div>
            <p className="muted">
                Move {ply} of {total}
            </p>
        </section>
    );
}

export default function GamePage() {
    // The game ID comes from the URL: /games/abcd1234
    const { lichessId } = useParams();
    const [result, setResult] = useState<GameLookup | null>(null);

    // Fetches whenever the ID changes. State is the only set in the callbacks
    // "cancelled" stops an outdated response from overwriting a newer one.
    useEffect(() => {
        if (!lichessId) return;
        let cancelled = false;
        getGame(lichessId)
            .then((game) => {
                if (!cancelled) setResult({ id: lichessId, game, error: null });
            })
            .catch((err: Error) => {
                if (!cancelled) setResult({ id: lichessId, game: null, error: err.message });
            });
        return () => {
            cancelled = true;
        };
    }, [lichessId]);

    // A stored result only counts if it belongs to the ID in the URL.
    const current = result?.id === lichessId ? result : null;

    if (!current) return <p>Loading...</p>
    if (current.error === "Not found") return <p>No game found with that ID.</p>
    if (current.error || !current.game) {
        return <p>Something went wrong: {current.error}</p>;
    }

    // Keying by game ID gives each game a fresh viewer that starts at move 0.
    return <GameViewer key={current.game.lichess_id} game={current.game} />;
}