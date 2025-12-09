import type {
  AuthResponse,
  LoginData,
  ProfileUpdateData,
  RegisterData,
  User,
} from "../types";
import api from "./api";

class AuthService {
  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    if (response.data.data.access_token) {
      this.setTokens(response.data.data);
    }
    return response.data;
  }

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    if (response.data.data.access_token) {
      this.setTokens(response.data.data);
    }
    return response.data;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      this.clearStorage();
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ data: User; message: string }>("/auth/me");
    localStorage.setItem("user", JSON.stringify(response.data.data));
    return response.data.data;
  }

  // Get profile
  async getProfile(): Promise<User> {
    const response = await api.get<{ data: User; message: string }>(
      "/auth/profile"
    );
    localStorage.setItem("user", JSON.stringify(response.data.data));
    return response.data.data;
  }

  // Update profile
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const response = await api.put<{ data: User; message: string }>(
      "/auth/profile",
      data
    );
    localStorage.setItem("user", JSON.stringify(response.data.data));
    return response.data.data;
  }

  // Upload avatar
  async uploadAvatar(
    file: File
  ): Promise<{ avatar_url: string; filename: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post<{
      data: { avatar_url: string; filename: string };
      message: string;
    }>("/auth/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Update user in localStorage
    const user = this.getCurrentUserFromStorage();
    if (user) {
      user.avatar = response.data.data.filename;
      user.avatar_url = response.data.data.avatar_url;
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data.data;
  }

  // Remove avatar
  async removeAvatar(): Promise<void> {
    await api.delete("/auth/profile/avatar");

    // Update user in localStorage
    const user = this.getCurrentUserFromStorage();
    if (user) {
      user.avatar = null;
      user.avatar_url = null;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  // Refresh token
  async refreshToken(): Promise<{ access_token: string }> {
    const response = await api.post<{ data: { access_token: string } }>(
      "/auth/refresh"
    );
    if (response.data.data.access_token) {
      localStorage.setItem("access_token", response.data.data.access_token);
    }
    return response.data.data;
  }

  // Helper methods
  private setTokens(data: any): void {
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  private clearStorage(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }
}

export default new AuthService();
