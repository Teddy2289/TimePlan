import React from "react";
import { DndProvider } from "./context/DndContext";
import AppRouter from "./components/Router";
import "./styles/globals.css";

const App: React.FC = () => {
  return (
    <DndProvider>
      <AppRouter />
    </DndProvider>
  );
};

export default App;
