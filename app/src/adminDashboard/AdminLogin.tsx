import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginStyles } from "./styles/AdminLogin.styles";

// Add this at the top of the file to fix the linter error for recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: any;
  }
}

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/internal");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.container}>
      <div className={loginStyles.card}>
        <div className="text-center mb-2">
          <h1 className={loginStyles.headline}>AdminLogin</h1>
        </div>
        {/* Email Login */}
        <form onSubmit={handleEmailLogin} className={loginStyles.form}>
          <div className={loginStyles.formGroup}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="email" required />
          </div>
          <div className={loginStyles.formGroup}>
            <Label htmlFor="password">Password</Label>
            <Input id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" autoComplete="current-password" required />
          </div>
          <Button type="submit" disabled={loading} className={loginStyles.button}>
            {loading ? "Logging in..." : "Login with Email"}
          </Button>
        </form>
        {error && <div className={loginStyles.error}>{error}</div>}
      </div>
    </div>
  );
}