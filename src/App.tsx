import { useEffect, useState } from "react";

import { getOpenings } from "./api/client";
import type { OpeningCount } from "./api/types";

function App() {
  const [openings, setOpenings] = useState<OpeningCount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Runs once after the first render: loads the data and records either the
  // result or the error message.
  useEffect(() => {
    getOpenings(10)
      .then(setOpenings)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Could not load openings: {error}</p>;

  return (
    <main>
      <h1>Most played openings</h1>
      <ol>
        {openings.map((o) => (
          <li key={o.opening}>
            {o.opening}: {o.games} games
          </li>
        ))}
      </ol>
    </main>
  );
}

export default App;