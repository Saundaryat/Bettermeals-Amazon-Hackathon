import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layouts/AuthLayout";
import { getAuthErrorMessage } from "@/lib/firebaseErrors";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(getAuthErrorMessage(err, "Failed to send reset email. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="mb-6 flex items-center">
                <Link to="/login" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                </Link>
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-sm text-gray-500">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            {success ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-green-800 mb-1">Check your email</h3>
                        <p className="text-sm text-green-600">
                            We've sent a password reset link to <strong>{email}</strong>.
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full bg-brand-green hover:bg-brand-darkGreen text-white rounded-lg h-10 sm:h-11 font-medium text-sm sm:text-base flex items-center justify-center space-x-2 transition-colors"
                    >
                        <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
}
