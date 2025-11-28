import { type RoutesConfig } from "../types/routes";
import Home from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
export const ROUTES: RoutesConfig = {
  HOME: {
    path: "/",
    component: Home,
    label: "Accueil",
    exact: true,
    showInNavigation: true,
  },
  DASHBOARD: {
    path: "/dashboard",
    component: Dashboard,
    label: "Tableau de bord",
    showInNavigation: true,
  },
  PROJET: {
    path: "/projet",
    component: Projects,
    label: "Projet",
    showInNavigation: true,
  },
  AOPIA_PROJECT: {
    path: "/projects/aopia",
    component: ProjectDetail,
    label: "AOPIA & LIKEFORMA",
    showInNavigation: false,
  },
  HOTEL_THAILAND_PROJECT: {
    path: "/projects/hotel-thailand",
    component: ProjectDetail,
    label: "Hotel Thaïlande",
    showInNavigation: false,
  },
  WIZI_LEARN_PROJECT: {
    path: "/projects/wizi-learn",
    component: ProjectDetail,
    label: "WIZI-LEARN, web-app",
    showInNavigation: false,
  },
  GRAPHISTE_PROJECT: {
    path: "/projects/graphiste",
    component: ProjectDetail,
    label: "Graphiste",
    showInNavigation: false,
  },
  TEST_PROJECT: {
    path: "/projects/test",
    component: ProjectDetail,
    label: "Test",
    showInNavigation: false,
  },
  PROJECT_NOTES: {
    path: "/projects/notes",
    component: ProjectDetail,
    label: "Project Notes",
    showInNavigation: false,
  },
};

// Helper pour obtenir les routes de navigation
export const getNavigationRoutes = () => {
  return Object.values(ROUTES).filter((route) => route.showInNavigation);
};

// Helper pour obtenir les paths
export const getRoutePaths = () => {
  const paths: { [key: string]: string } = {};
  Object.entries(ROUTES).forEach(([key, route]) => {
    paths[key] = route.path;
  });
  return paths;
};
