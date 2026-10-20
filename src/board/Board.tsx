import { useId } from "react";

import type { PlacedPiece } from "../chess/position";
import { cozySet } from "../pieces/cozy";
import type { PieceSet } from "../pieces/types";

// Board geometry in SVG units. The whole drawing scales to fit its container.
const SQUARE = 80;
const FRAME = 28;
const PLAY = SQUARE * 8;
const SIZE = PLAY + FRAME * 2;

// Warm palette for the board.
// Coolors.com is the goat btw
const COLORS = {
    frame: "#6b4430",
    frameLine: "#a97b55",
    light: "#f1dcbc",
    dark: "#b98a62",
    highlight: "#c4693d",
    label: "#f1dcbc"
};

interface BoardProps {
    pieces: PlacedPiece[];
    lastMove?: { from: string; to: string } | null;
    pieceSet?: PieceSet;
}

// Converts a square name like "e4" into the pixel position of its top-left corner.
// White is drawn at the bottom: file "a" is on the left, rank 8 on top.
function squareOrigin(square: string): { x: number; y: number } {
    const file = square.charCodeAt(0) - 97;
    const rank = Number(square[1]);
    return { x: FRAME + file * SQUARE, y: FRAME + (8 - rank) * SQUARE };
}

export default function BOARD({
    pieces,
    lastMove = null,
    pieceSet = cozySet,
}: BoardProps) {
    // A unique id per board for the clip path. useId returns ids containing colons
    // which are not safe inside url(#...), so they are removed.
    const clipId = `clip-${useId().replace(/:/g, "")}`;

    // The 64 squares, light or dark depending on the file + rank.
    const squares = [];
    for (let file = 0; file < 8; file++) {
        for (let rank = 1; rank <= 8; rank++) {
            const isLight = (file + rank) % 2 === 0;
            squares.push(
                <rect
                    key={`${file}-${rank}`}
                    x={FRAME + file * SQUARE}
                    y={FRAME + (8 - rank) * SQUARE}
                    width={SQUARE}
                    height={SQUARE}
                    fill={isLight ? COLORS.light : COLORS.dark}
                />,
            );
        }
    }

    return (
        <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="board"
            role="img"
            aria-label="Chess board"
        >
            <defs>
                {/* Rounds the corners of the playing area. */}
                <clipPath id={clipId}>
                    <rect x={FRAME} y={FRAME} width={PLAY} height={PLAY} rx={14} />
                </clipPath>
            </defs>

            {/* Outer frame with rounded corners + a thin inner line. */}
            <rect width={SIZE} height={SIZE} rx={36} fill={COLORS.frame} />
            <rect
                x={6}
                y={6}
                width={SIZE - 12}
                height={SIZE - 12}
                rx={30}
                fill="none"
                stroke={COLORS.frameLine}
                strokeWidth={2}
            />

            {/* Squares and last-move highlight, clipped ot the rounded area. */}
            <g clipPath={`url(#${clipId})`}>
                {squares}
                {lastMove &&
                    [lastMove.from, lastMove.to].map((square) => {
                        const { x, y } = squareOrigin(square);
                        return (
                            <rect
                                key={square}
                                x={x}
                                y={y}
                                width={SQUARE}
                                height={SQUARE}
                                fill={COLORS.highlight}
                                opacity={0.45}
                            />
                        );
                    })
                }
            </g>
            
            {/* Outline around the playing area. */}
            <rect 
                x={FRAME}
                y={FRAME}
                width={PLAY}
                height={PLAY}
                rx={14}
                fill="none"
                stroke={COLORS.frameLine}
                strokeWidth={2}
            /> 

            {/* File letters along the bottom of the frame, rank numbers on the left. */}
            {"abcdefgh".split("").map((letter, i) => (
                <text
                    key={letter}
                    x={FRAME + i * SQUARE + SQUARE / 2}
                    y={SIZE - FRAME / 2}
                    fill={COLORS.label}
                    fontSize={16}
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    {letter}
                </text>
            ))}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((rank) => (
                <text
                    key={rank}
                    x={FRAME / 2}
                    y={FRAME + (8 - rank) * SQUARE + SQUARE / 2}
                    fill={COLORS.label}
                    fontSize={16}
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    {rank}
                </text>
            ))}

            {/* Pieces: each is dawn in a 100x100 box, then moved & scaled. */}
            {pieces.map((piece) => {
                const { x, y } = squareOrigin(piece.square);
                return (
                    <g
                        key={piece.square}
                        transform={`translate(${x} ${y}) scale(${SQUARE / 100})`}
                    >
                        {pieceSet.render(piece.type, piece.color)}
                    </g>
                );
            })}
        </svg>
    );
}