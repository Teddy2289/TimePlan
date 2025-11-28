export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  label: string;
  exact?: boolean;
  icon?: React.ComponentType;
  showInNavigation?: boolean;
}

export interface RoutesConfig {
  [key: string]: RouteConfig;
}
