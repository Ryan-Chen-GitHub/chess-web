// These mirror the response models in the API's app/schemas.py.
export interface OpeningCount {
  opening: string;
  games: number;
}

export interface OpeningStats {
  eco: string;
  games: number;
  white_wins: number;
  black_wins: number;
  draws: number;
  white_win_rate: number;
}

export interface PlayerRecord {
  username: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  top_openings: OpeningCount[];
}

// One half-move of a game, as returned by GET /games/{lichess_id}.
export interface MoveOut {
  ply: number;
  san: string;
  uci: string;
}

// A game with its full move list, mirroring GameDetail in the API.
export interface GameDetail {
  lichess_id: string;
  white: string;
  black: string;
  white_elo: number | null;
  black_elo: number | null;
  result: string;
  eco: string | null;
  opening: string | null;
  played_at: string | null;
  moves: MoveOut[];
}