import { useNavigate, useLocation } from "react-router-dom";
import { getNavigationRoutes } from "../config/routes";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationRoutes = getNavigationRoutes();

  return {
    navigateTo,
    isActiveRoute,
    navigationRoutes,
    currentPath: location.pathname,
  };
};
