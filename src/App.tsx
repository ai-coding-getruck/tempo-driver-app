import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/Home";

// Import routes for Tempo if in development
const tempoRoutes = import.meta.env.VITE_TEMPO ? import("tempo-routes") : null;

function App() {
  // Render Tempo routes if in development
  const tempoRoutesElement = import.meta.env.VITE_TEMPO
    ? useRoutes(tempoRoutes)
    : null;

  return (
    <div className="app">
      {tempoRoutesElement}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add your app routes here */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
      </Routes>
    </div>
  );
}

export default App;
