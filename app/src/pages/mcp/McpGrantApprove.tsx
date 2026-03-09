import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layouts/AuthLayout";
import {
  approveMcpGrantRequest,
  fetchMcpGrantRequestContext,
  fetchMcpSessionMe,
  McpGrantRequestContext,
  rejectMcpGrantRequest,
} from "@/services/mcpAuth.service";

export default function McpGrantApprove() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request_id") || "";
  const accountId = searchParams.get("account_id") || "";
  const [loading, setLoading] = useState(true);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [requestContext, setRequestContext] = useState<McpGrantRequestContext | null>(null);
  const [submitting, setSubmitting] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const restartSignInUrl = useMemo(() => {
    const nextPath = `/app/mcp/grants/approve?request_id=${encodeURIComponent(requestId)}&account_id=${encodeURIComponent(accountId)}`;
    return `/api/v1/mcp-auth/identity/google/start?next=${encodeURIComponent(nextPath)}`;
  }, [accountId, requestId]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!requestId.trim()) {
        setError("Missing request_id. Use a valid grant approval link.");
        setLoading(false);
        return;
      }
      if (!accountId.trim()) {
        setError("Missing account_id. Ask the requester to share the full approval link.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      setInfo("");
      try {
        const session = await fetchMcpSessionMe();
        if (!active) return;
        if (!session.authenticated) {
          setNeedsSignIn(true);
          setError("Sign in is required before you can review grant access.");
          setLoading(false);
          return;
        }
        const context = await fetchMcpGrantRequestContext(requestId, accountId);
        if (!active) return;
        setRequestContext(context);
        setNeedsSignIn(false);
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Failed to load grant request.";
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [accountId, requestId]);

  const handleApprove = async () => {
    if (!requestId.trim()) return;
    setSubmitting("approve");
    setError("");
    setInfo("");
    try {
      const result = await approveMcpGrantRequest(requestId);
      const message = result.message || "Grant approved successfully.";
      setInfo(message);
      setRequestContext((prev) => (prev ? { ...prev, status: "APPROVED" } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve grant.");
    } finally {
      setSubmitting(null);
    }
  };

  const handleReject = async () => {
    if (!requestId.trim()) return;
    setSubmitting("reject");
    setError("");
    setInfo("");
    try {
      const result = await rejectMcpGrantRequest(requestId, "owner_rejected");
      const message = result.message || "Grant request rejected.";
      setInfo(message);
      setRequestContext((prev) => (prev ? { ...prev, status: "REJECTED" } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject grant.");
    } finally {
      setSubmitting(null);
    }
  };

  const status = requestContext?.status || "UNKNOWN";
  const canApprove = !loading && !needsSignIn && status === "PENDING_APPROVAL";
  const canReject = canApprove;

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">BetterMeals MCP</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Grant Access Approval</h1>
          <p className="text-sm text-gray-500 mt-2">
            Review this organization access request for your linked Blinkit account.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-400 mb-1">Grant request ID</p>
          <p className="text-sm font-mono text-gray-700 break-all">{requestId || "missing"}</p>
          <p className="text-xs text-gray-500 mt-2">account: {accountId || "missing"}</p>
        </div>

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">
            Loading grant request...
          </div>
        ) : requestContext ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
            <p className="text-sm text-gray-700">Status: {requestContext.status || "UNKNOWN"}</p>
            <p className="text-sm text-gray-700">Organization: {requestContext.org_id || "N/A"}</p>
            <p className="text-sm text-gray-700">Account: {requestContext.account_id || "N/A"}</p>
            <p className="text-sm text-gray-700">
              Scope: {(requestContext.requested_scopes || []).join(", ") || "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              Duration: {requestContext.requested_ttl_days ? `${requestContext.requested_ttl_days} days` : "default"}
            </p>
          </div>
        ) : null}

        {info ? (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{info}</div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
            {needsSignIn ? (
              <div className="mt-2">
                <a href={restartSignInUrl} className="underline font-medium text-red-800">
                  Sign in for MCP grant approval
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={handleReject}
            disabled={!canReject || submitting !== null}
          >
            {submitting === "reject" ? "Rejecting..." : "Reject Access"}
          </Button>
          <Button
            type="button"
            className="flex-1 h-11 text-white font-medium"
            style={{ backgroundColor: "#51754f" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a6b46")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#51754f")}
            onClick={handleApprove}
            disabled={!canApprove || submitting !== null}
          >
            {submitting === "approve" ? "Approving..." : "Approve Access"}
          </Button>
        </div>

        <div className="pt-2 text-xs text-gray-500">
          <a href={restartSignInUrl} className="underline">
            Restart sign-in
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
