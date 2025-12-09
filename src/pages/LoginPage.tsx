import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { type LoginData } from "../services/authService";
import { Lock, Mail, ArrowRight, Crown } from "lucide-react";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [apiError, setApiError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;
    try {
      await login(formData);
      navigate("/");
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginData])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (apiError) setApiError("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand/Visual */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#31b6b8] to-[#259a9c] items-center justify-center p-12">
        <div className="max-w-md text-white">
          {/* Logo avec TalenTop à côté */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold">M</span>
              </div>
              <div className="text-left">
                <div className="flex items-center">
                  <h1 className="text-4xl font-bold">
                    <span style={{ color: "#ab2283" }}>MBL</span>
                    <span className="text-white">-Service</span>
                  </h1>
                </div>
                <div className="flex items-center mt-1">
                  <Crown
                    className="w-5 h-5 mr-1"
                    style={{ color: "#D4AF37" }}
                  />
                  <span
                    className="text-xl font-bold"
                    style={{
                      background: "linear-gradient(to right, #D4AF37, #000000)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                    TalenTop
                  </span>
                </div>
              </div>
            </div>
            <p className="text-white/80 text-center">
              Excellence de la gestion des tâches
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold">
                  Organiser les tâches efficacement
                </h3>
                <p className="text-sm text-white/70">
                  Gérer des projets avec facilité
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded-sm"></div>
              </div>
              <div>
                <h3 className="font-semibold">Suivi des progrès</h3>
                <p className="text-sm text-white/70">
                  Mises à jour en temps réel sur tous les projets
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-4 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold">Bon retour parmi nous</h3>
                <p className="text-sm text-white/70">
                  Continuez à gérer votre travail efficacement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full">
          {/* Mobile Logo avec TalenTop */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#31b6b8] to-[#259a9c] rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">M</span>
              </div>
              <div className="text-left">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">
                    <span style={{ color: "#ab2283" }}>MBL</span>
                    <span className="text-gray-900">-Service</span>
                  </h1>
                </div>
                <div className="flex items-center mt-1">
                  <Crown
                    className="w-4 h-4 mr-1"
                    style={{ color: "#D4AF37" }}
                  />
                  <span
                    className="text-lg font-bold"
                    style={{
                      background: "linear-gradient(to right, #D4AF37, #000000)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                    TalenTop
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-center">
              Task Management Excellence
            </p>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Bon retour parmi nous
            </h1>
            <p className="text-gray-600 mt-2">
              Connectez-vous pour continuer vers votre tableau de bord
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            {apiError && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-[#31b6b8] focus:border-transparent`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#31b6b8] hover:text-[#259a9c]">
                    Mot de passe oublié?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-[#31b6b8] focus:border-transparent`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#31b6b8] text-white font-medium py-3.5 rounded-lg hover:bg-[#259a9c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31b6b8] disabled:opacity-50 transition-colors flex items-center justify-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    Connectez-vous
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Vous n’avez pas de compte ?{" "}
                <Link
                  to="/register"
                  className="text-[#31b6b8] font-medium hover:text-[#259a9c]">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
