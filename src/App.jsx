import { BrowserRouter, Route, Routes } from "react-router-dom";
import GameList from "./pages/GameList";
import Game from "./pages/Game";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameList />} />
          {/* dynamic id to reflect content item id. */}
          <Route path="/games/:id" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
