import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function RequireAuth({
  children,
  redirectTo = "/login",
}: {
  children?: JSX.Element;
  redirectTo?: string;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [intendedPath, setIntendedPath] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      setIntendedPath(location.pathname);
    }
  }, [user, loading, location.pathname]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to={redirectTo} state={{ from: intendedPath }} replace />;

  return children ? children : <Outlet />;
}