import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import AuthService, {
  type User,
  type LoginData,
  type RegisterData,
  type ProfileUpdateData,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  removeAvatar: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Vérifier si un token existe
        const token = localStorage.getItem("access_token");

        if (token) {
          try {
            // Essayer de récupérer les informations utilisateur
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error("Failed to fetch user:", error);
            // Si le token est invalide, nettoyer le localStorage
            AuthService.clearStorage();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(data);
      setUser(response.data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(data);
      setUser(response.data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    const updatedUser = await AuthService.updateProfile(data);
    setUser(updatedUser);
  };

  const uploadAvatar = async (file: File) => {
    await AuthService.uploadAvatar(file);
    const updatedUser = await AuthService.getProfile();
    setUser(updatedUser);
  };

  const removeAvatar = async () => {
    await AuthService.removeAvatar();
    const updatedUser = await AuthService.getProfile();
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    if (AuthService.isAuthenticated()) {
      const updatedUser = await AuthService.getProfile();
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
