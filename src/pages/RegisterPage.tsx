import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { type RegisterData } from "../services/authService";
import { User, Mail, Lock, ArrowRight, Check, X, Crown } from "lucide-react";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [apiError, setApiError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};
    if (!formData.name) newErrors.name = "Name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.password_confirmation)
      newErrors.password_confirmation = "Password confirmation is required";
    else if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;
    try {
      await register(formData);
      navigate("/");
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterData])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (apiError) setApiError("");
  };

  // Password requirements
  const passwordRequirements = [
    { label: "Au moins 6 caractères", met: formData.password.length >= 6 },
    {
      label: "Contient une lettre majuscule",
      met: /[A-Z]/.test(formData.password),
    },
    { label: "Contient des nombres", met: /[0-9]/.test(formData.password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);

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
                <h3 className="font-semibold">Track Progress</h3>
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
                <h3 className="font-semibold">Joindre notre équipe</h3>
                <p className="text-sm text-white/70">
                  Commencez à gérer votre travail efficacement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
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
              Excellence de la gestion des tâches
            </p>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Créer un compte
            </h1>
            <p className="text-gray-600 mt-2">
              Inscrivez-vous pour commencer à gérer vos tâches
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            {apiError && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-[#31b6b8] focus:border-transparent`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
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

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
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

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600 font-medium">
                      Exigences de mot de passe :
                    </p>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center text-sm">
                          {req.met ? (
                            <Check size={14} className="text-green-500 mr-2" />
                          ) : (
                            <X size={14} className="text-red-500 mr-2" />
                          )}
                          <span
                            className={
                              req.met ? "text-green-600" : "text-gray-500"
                            }>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.password_confirmation
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-[#31b6b8] focus:border-transparent`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              {/* <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-[#31b6b8] focus:ring-[#31b6b8] border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#31b6b8] font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#31b6b8] font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !allRequirementsMet}
                className={`w-full ${
                  allRequirementsMet
                    ? "bg-[#31b6b8] hover:bg-[#259a9c]"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white font-medium py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31b6b8] disabled:opacity-50 transition-colors flex items-center justify-center`}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Créer un compte...
                  </>
                ) : (
                  <>
                    Créer un compte
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                - Vous avez déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="text-[#31b6b8] font-medium hover:text-[#259a9c]">
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
