import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ROUTES } from "../config/routes";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {Object.values(ROUTES).map((route) => {
          const RouteComponent = route.component;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<RouteComponent />}
            />
          );
        })}
        {/* Redirection par défaut vers la page d'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
