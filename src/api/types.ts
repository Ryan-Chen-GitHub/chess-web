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