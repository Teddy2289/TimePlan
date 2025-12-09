import { type ComponentType } from "react";
export interface RouteConfig {
  path: string;
  component: ComponentType;
  label: string;
  exact?: boolean;
  showInNavigation: boolean;
  requiresAuth?: boolean;
  isPublic?: boolean;
}

export interface RoutesConfig {
  [key: string]: RouteConfig;
}
