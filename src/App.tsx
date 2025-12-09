// src/App.tsx
import React from "react";
import { DndProvider } from "./context/DndContext";
import { AuthProvider } from "./context/AuthContext";
import { WorkTimeProvider } from "./context/WorkTimeContext";
import AppRouter from "./components/Router";
import "./styles/globals.css";
import { ToastProvider } from "./context/ToastContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DndProvider>
        <WorkTimeProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </WorkTimeProvider>
      </DndProvider>
    </AuthProvider>
  );
};

export default App;
