import type { ReactNode } from "react";

import type { PieceSet, PieceType } from "./types";

// Colors per side: body fill, outline, and the small detail marks.
// Coolors.com is an amazing website for finding complimenting colors, go check it out!
const SIDES = {
    w: { fill: "#fbf3e4", stroke: "#5a3a28", detail: "#5a3a28"},
    b: { fill: "#4b2f22", stroke: "#24140d", detail: "#f0dcc0"},
};

// The rounded base plate that every piece stands on
const base = <rect x="26" y="77" width="48" height="12" rx="6" />;

// The colors of one side (fill, outline, and detail marks).
type Side = (typeof SIDES)["w"];

// One drawing function per piece type, in a 100x100 box. Fill and outline
// come from the wrapping <g>; "detail" is used for smaller marks like the eye
// SURELY THERE'S A BETTER WAY TO MAKE THESE?
// or at least an easier way... :(
const SHAPES: Record<PieceType, (side: Side) => ReactNode> = {
    p: () => (
        <>
            <circle cx="50" cy="30" r="12" />
            <path d="M37 80 C37 62 42 54 50 50 C58 54 63 62 63 80 Z" />
        </>
    ),
    r: () => (
        <>
            {/*} Indented top, then the tower body. */}
            <path d="M30 24 H39 V31 H46 V24 H54 V31 H61 V24 H70 V40 H30 Z" />
            <path d="M35 40 H66 L66 78 H35 Z" />
        </>
    ),
    n: ({ detail }) => (
        <>
            {/* An abstract horse head facing left, with an ear and a small eye.*/}
            <path d="M34 80 C34 62 42 52 50 44 C44 42 35 70 30 44 C28 38 36 24 46 20 L48 12 L55 19 C70 22 74 40 70 56 C68 66 66 72 66 80 Z" />
            <circle cx="53" cy="32" r="2.8" fill={detail} stroke="none" />
        </>
    ),
    b: ({ detail }) => (
        <>
            <circle cx="50" cy="16" r="5" />
            {/* Teardrop body with a diagonal slit. */}
            <path d="M50 24 C64 34 68 48 60 60 C58 64 62 68 64 78 H36 C38 68 42 64 40 60 C32 48 36 34 50 24 Z" />
            <path d="M45 40 L55 50" stroke={detail} fill="none" />
        </>
    ),
    q: () => (
        <>
        {/* Five-pointed crown with a ball on each point. */}
        <path d="M30 78 L24 36 L36 56 L38 30 L46 54 L50 26 L54 54 L62 30 L64 56 L76 36 L70 78 Z" />
        <circle cx="24" cy="33" r="4" />
        <circle cx="38" cy="26" r="4" />
        <circle cx="50" cy="22" r="4" />
        <circle cx="62" cy="26" r="4" />
        <circle cx="76" cy="33" r="4" />
        </>
    ),
    k: ({ fill, stroke }) => (
        <>
            {/* A cross is drawn first, so the body covers where it joins. Two
            strokes on one path make an outlined cross: a wide outline-colored
            stroke underneath and a narrower fill-colored stroke on top. This
            keeps it visible on both light and dark squares. */}
            <path d="M50 8 V44 M40 20 H60" stroke={stroke} strokeWidth={10} fill="none" />
            <path d="M50 8 V44 M40 20 H60" stroke={fill} strokeWidth={4} fill="none" />
            <path d="M32 80 C30 62 28 48 38 42 C42 40 46 40 50 40 C54 40 58 40 62 42 C72 48 70 62 68 80 Z" />
        </>
    ),
};

// The "cozySet" piece set: soft shapes with warm cream and chocolate tones.
export const cozySet: PieceSet = {
    id: "cozy",
    name: "Cozy",
    render(type, color) {
        const side = SIDES[color];
        const { fill, stroke } = side;
        return (
            <g
                fill={fill}
                stroke={stroke}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
            >
                {SHAPES[type](side)}
                {base}
            </g>
        );
    },
};
