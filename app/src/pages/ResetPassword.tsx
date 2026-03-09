import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layouts/AuthLayout";
import { getAuthErrorMessage } from "@/lib/firebaseErrors";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
    const { confirmReset } = useAuth();
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get("oobCode");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!oobCode) {
            setError("Invalid password reset link. Please request a new one.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            await confirmReset(oobCode, password);
            setSuccess(true);
        } catch (err: any) {
            setError(getAuthErrorMessage(err, "Failed to reset password. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    if (!oobCode && !success && !error) {
        return (
            <AuthLayout>
                <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-red-800 mb-1">Invalid Link</h3>
                        <p className="text-sm text-red-600 mb-4">
                            This password reset link is invalid or missing the required authorization code.
                        </p>
                        <Link to="/forgot-password">
                            <Button
                                className="w-full bg-brand-green hover:bg-brand-darkGreen text-white rounded-lg h-10 sm:h-11 font-medium text-sm sm:text-base transition-colors"
                            >
                                Request New Link
                            </Button>
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h1>
                <p className="text-sm text-gray-500">
                    Please enter your new password below.
                </p>
            </div>

            {success ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-green-800 mb-1">Password Reset Successful</h3>
                        <p className="text-sm text-green-600 mb-6">
                            Your password has been successfully updated. You can now log in with your new password.
                        </p>
                        <Link to="/login">
                            <Button
                                className="w-full bg-brand-green hover:bg-brand-darkGreen text-white rounded-lg h-10 sm:h-11 font-medium text-sm sm:text-base flex items-center justify-center space-x-2 transition-colors"
                            >
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* New Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder=""
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="h-9 sm:h-11 bg-gray-50 border-gray-200 pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
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
                        disabled={loading || !password || !confirmPassword}
                        className="w-full bg-brand-green hover:bg-brand-darkGreen text-white rounded-lg h-10 sm:h-11 font-medium text-sm sm:text-base flex items-center justify-center space-x-2 mt-4 transition-colors"
                    >
                        <span>{loading ? "Resetting..." : "Reset Password"}</span>
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
}
