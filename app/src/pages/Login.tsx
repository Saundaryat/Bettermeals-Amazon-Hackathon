import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import LocalStorageManager from "@/lib/localStorageManager";
import AuthLayout from "@/components/layouts/AuthLayout";
import { getAuthErrorMessage } from "@/lib/firebaseErrors";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const householdId = LocalStorageManager.getHouseholdId();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || (householdId ? `/dashboard/${householdId}` : '/');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(email, password);

      // Get household ID from the login result
      const householdIdFromLogin = result.extendedUser?.household_id;

      // Check if user is onboarded and navigate accordingly
      if (result.extendedUser?.is_onboarded === false) {
        // Navigate to onboarding if not onboarded
        navigate('/onboarding');
      } else {
        // Navigate to dashboard with the household ID from login
        if (householdIdFromLogin) {
          navigate(`/dashboard/${householdIdFromLogin}`);
        } else {
          // Fallback to the original logic if no household ID
          navigate(from);
        }
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Top Toggle */}
      <div className="bg-gray-100 p-1 rounded-lg flex mb-4 sm:mb-6">
        <button
          onClick={() => {
            const searchParams = new URLSearchParams(location.search);
            navigate(`/registration?${searchParams.toString()}`);
          }}
          className="flex-1 py-1.5 sm:py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 transition-colors"
        >
          Sign Up
        </button>
        <button
          className="flex-1 py-1.5 sm:py-2 text-sm font-medium text-gray-900 bg-white rounded-md shadow-sm"
        >
          Login
        </button>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4 sm:space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="h-9 sm:h-11 bg-gray-50 border-gray-200"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="h-9 sm:h-11 bg-gray-50 border-gray-200 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-start">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-brand-green hover:text-brand-darkGreen transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-green hover:bg-brand-darkGreen text-white rounded-lg h-10 sm:h-11 font-medium text-sm sm:text-base flex items-center justify-center space-x-2 transition-colors"
        >
          <span>{loading ? "Logging in..." : "Login"}</span>
        </Button>


      </form>
    </AuthLayout>
  );
}
