import type { ReactNode } from "react";

// The six kinds of pieces, using chess.js' one-letter codes.
// I really don't like how knight is coded by n but oh well
export type PieceType = "p" | "n" | "b" | "r"| "q" | "k";

// "w" for White and "b" for Black.
export type PieceColor = "w" | "b";

// A piece set draws any piece inside a 100x100 box. The board scales and places it
// So a new set (such as custom pieces) only needs to implement this interface.
export interface PieceSet {
    id: string;
    name: string;
    render: (type: PieceType, color: PieceColor) => ReactNode;
}