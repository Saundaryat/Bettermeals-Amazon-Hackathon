import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import RequireAuth from "./components/RequireAuth";
import FeedbackTicker from "./components/FeedbackTicker";

// ─── Lazy-loaded route components ────────────────────────────────────────────
// Each page is loaded on-demand, not on initial bundle load.
// This drastically reduces the initial JS payload.
const NotFound = lazy(() => import("./pages/NotFound"));
const MealPlanPreview = lazy(() => import("./pages/MealPlanPreview"));
const GroceryList = lazy(() => import("./pages/GroceryList"));
const PaymentCheckout = lazy(() => import("./pages/PaymentCheckout"));
const SuccessCelebration = lazy(() => import("./pages/SuccessCelebration"));
const HouseholdNotFound = lazy(() => import("./pages/HouseholdNotFound"));
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PlanApproval = lazy(() => import("./pages/PlanApproval"));
const Registration = lazy(() => import("./pages/Registration"));
const OnboardingDispatcher = lazy(() => import("./components/onboarding-form/OnboardingDispatcher"));
const InternalDashboard = lazy(() => import("./adminDashboard/InternalDashboard"));
const AdminLogin = lazy(() => import("./adminDashboard/AdminLogin"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const CycleSyncingPreOnboarding = lazy(() => import("./pages/CycleSyncingPreOnboarding"));
const OnboardingSuccess = lazy(() => import("./pages/OnboardingSuccess"));
const McpAuthorize = lazy(() => import("./pages/mcp/McpAuthorize"));
const McpGrantApprove = lazy(() => import("./pages/mcp/McpGrantApprove"));

// ─── Page loader fallback ─────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
    <div style={{ width: 32, height: 32, border: "3px solid #e5e7eb", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── QueryClient with sensible production defaults ────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min — don't re-fetch on every render
      retry: 1,                     // retry once, not 3x (default)
      refetchOnWindowFocus: false,  // meal plans don't change on tab switch
    },
  },
});

const App = () => {
  // Removed useLocalStorage for server state. 
  // Components will now fetch data directly using React Query hooks.

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <FeedbackTicker />
          <BrowserRouter basename="/app">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/household-not-found" element={<HouseholdNotFound />} />
                <Route path="/cyclesynced/preonboarding" element={<CycleSyncingPreOnboarding />} />
                <Route path="/mcp/authorize" element={<McpAuthorize />} />
                <Route path="/mcp/grants/approve" element={<McpGrantApprove />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth />}>
                  <Route path="/onboarding" element={<OnboardingDispatcher />} />
                  <Route path="/onboarding-features" element={<Navigate to="/onboarding" replace />} />
                  <Route path="/onboarding-feature" element={<Navigate to="/onboarding" replace />} />

                  <Route path="/cyclesynced/onboarding" element={<Navigate to="/onboarding" replace />} />
                  <Route path="/cyclesynced/onboarding-features" element={<Navigate to="/cyclesynced/onboarding" replace />} />
                  <Route path="/cyclesynced/onboarding-feature" element={<Navigate to="/cyclesynced/onboarding" replace />} />

                  <Route path="/onboarding-form" element={<Navigate to="/onboarding" replace />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard/:householdId" element={<Dashboard />} />
                </Route>

                {/* Admin Protected Route */}
                <Route path="/internal" element={<RequireAuth redirectTo="/admin-login"><InternalDashboard /></RequireAuth>} />

                <Route path="/onboarding-success" element={<RequireAuth><OnboardingSuccess /></RequireAuth>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

