// routes.ts - Ajoutez une route dynamique pour ProjectDetail
import { type RoutesConfig } from "../types/routes";
import Home from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";

export const ROUTES: RoutesConfig = {
  // Routes publiques
  LOGIN: {
    path: "/login",
    component: LoginPage,
    label: "Connexion",
    exact: true,
    showInNavigation: false,
    isPublic: true,
  },
  REGISTER: {
    path: "/register",
    component: RegisterPage,
    label: "Inscription",
    showInNavigation: false,
    isPublic: true,
  },

  // Routes protégées
  HOME: {
    path: "/",
    component: Home,
    label: "Accueil",
    exact: true,
    showInNavigation: true,
    requiresAuth: true,
  },
  DASHBOARD: {
    path: "/dashboard",
    component: Dashboard,
    label: "Tableau de bord",
    showInNavigation: true,
    requiresAuth: true,
  },
  PROJET: {
    path: "/projet",
    component: Projects,
    label: "Projet",
    showInNavigation: true,
    requiresAuth: true,
  },
  PROFILE: {
    path: "/profile",
    component: ProfilePage,
    label: "Profil",
    showInNavigation: false,
    requiresAuth: true,
  },

  // Route dynamique pour les projets - À AJOUTER
  PROJECT_DETAIL: {
    path: "/projects/:projectId",
    component: ProjectDetail,
    label: "Détails du projet",
    showInNavigation: false,
    requiresAuth: true,
  },

  // Routes statiques pour les projets (optionnel - vous pouvez les supprimer si vous utilisez uniquement les projets dynamiques)
  AOPIA_PROJECT: {
    path: "/projects/aopia",
    component: ProjectDetail,
    label: "AOPIA & LIKEFORMA",
    showInNavigation: false,
    requiresAuth: true,
  },
  HOTEL_THAILAND_PROJECT: {
    path: "/projects/hotel-thailand",
    component: ProjectDetail,
    label: "Hotel Thaïlande",
    showInNavigation: false,
    requiresAuth: true,
  },
  WIZI_LEARN_PROJECT: {
    path: "/projects/wizi-learn",
    component: ProjectDetail,
    label: "WIZI-LEARN, web-app",
    showInNavigation: false,
    requiresAuth: true,
  },
  GRAPHISTE_PROJECT: {
    path: "/projects/graphiste",
    component: ProjectDetail,
    label: "Graphiste",
    showInNavigation: false,
    requiresAuth: true,
  },
  TEST_PROJECT: {
    path: "/projects/test",
    component: ProjectDetail,
    label: "Test",
    showInNavigation: false,
    requiresAuth: true,
  },
  PROJECT_NOTES: {
    path: "/projects/notes",
    component: ProjectDetail,
    label: "Project Notes",
    showInNavigation: false,
    requiresAuth: true,
  },
};

// Helper pour obtenir les routes de navigation
export const getNavigationRoutes = () => {
  return Object.values(ROUTES).filter((route) => route.showInNavigation);
};

// Helper pour obtenir les routes publiques
export const getPublicRoutes = () => {
  return Object.values(ROUTES).filter((route) => route.isPublic);
};

// Helper pour obtenir les routes protégées
export const getProtectedRoutes = () => {
  return Object.values(ROUTES).filter((route) => route.requiresAuth);
};

// Helper pour obtenir les paths
export const getRoutePaths = () => {
  const paths: { [key: string]: string } = {};
  Object.entries(ROUTES).forEach(([key, route]) => {
    paths[key] = route.path;
  });
  return paths;
};
