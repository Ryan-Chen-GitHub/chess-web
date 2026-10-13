import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import OpeningsPage from "./pages/OpeningsPage";
import PlayerPage from "./pages/PlayerPage";

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
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;