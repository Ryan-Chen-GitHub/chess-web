import { Chess } from "chess.js";

import type { PieceColor, PieceType } from "../pieces/types";

// One piece standing on one square, such as a white pawn on "e4".
export interface PlacedPiece {
    square: string;
    type: PieceType;
    color: PieceColor;
}

// What the board needs to draw: where every piece is, and the last move.
export interface Position {
    pieces: PlacedPiece[];
    lastMove: { from: string; to: string } | null;
}

// Replayed the first `ply` half-moves (given in SAN) from the starting position
// and reports the resulting baord. chess.js throws on an illegal move
// which would mean the stored game data is corrupt.
export function positionAfter(sans: string[], ply: number): Position {
    const chess = new Chess();
    let lastMove: Position["lastMove"] = null;

    for (const san of sans.slice(0, ply)) {
        const move = chess.move(san);
        lastMove = { from: move.from, to: move.to };
    }

    // board() is an 8x8 grid with null for empty squares; flatMap flattens
    // and drops the empty squares in one pass.
    const pieces = chess.board().flatMap((row) =>
        row.flatMap((cell) =>
            cell ? [{ square: cell.square, type: cell.type, color: cell.color }] : [],
        ),
    );

    return { pieces, lastMove };
}