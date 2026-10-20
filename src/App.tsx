import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import OpeningsPage from "./pages/OpeningsPage";
import PlayerPage from "./pages/PlayerPage";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Openings</Link> | <Link to="/players">Players</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<OpeningsPage />} />
          <Route path="/players" element={<PlayerPage />} />
          <Route path="/players/:username" element={<PlayerPage />} />
          <Route path="/games/:lichessId" element={<GamePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;