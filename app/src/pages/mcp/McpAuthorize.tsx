import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchMcpAuthorizeRequestContext,
  fetchMcpSessionMe,
  requestMcpLinkOtp,
  submitMcpAuthorizationDecision,
  verifyMcpLinkOtp,
} from "@/services/mcpAuth.service";
import AuthLayout from "@/components/layouts/AuthLayout";

const scopeDescriptions: Record<string, string> = {
  "mcp.invoke": "Run Blinkit MCP tools on your behalf",
  "catalog:read": "Read product/search data",
  "cart:write": "Create and update cart items",
  "checkout:write": "Prepare and place checkout",
  "order:write": "Place or modify order actions",
};

function describeScope(scope: string): string {
  return scopeDescriptions[scope] || "Access requested by the MCP client";
}

export default function McpAuthorize() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request_id") || "";
  const signedOut = (searchParams.get("signed_out") || "").toLowerCase() === "1";
  const [loadingContext, setLoadingContext] = useState(true);
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [scopes, setScopes] = useState<string[]>([]);
  const [requestStatus, setRequestStatus] = useState("");
  const [expiresAtIso, setExpiresAtIso] = useState<string | null>(null);
  const [linkedAccountId, setLinkedAccountId] = useState<string>("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkId, setLinkId] = useState("");
  const [otp, setOtp] = useState("");
  const [linking, setLinking] = useState<"request" | "verify" | null>(null);
  const [submitting, setSubmitting] = useState<"allow" | "deny" | null>(null);
  const [redirectUri, setRedirectUri] = useState("");
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const canSubmit = useMemo(() => requestId.trim().length > 0, [requestId]);
  const requestActive = useMemo(() => requestStatus === "PENDING", [requestStatus]);
  const canAllow = useMemo(
    () => canSubmit && requestActive && linkedAccountId.trim().length > 0,
    [canSubmit, linkedAccountId, requestActive]
  );
  const canDeny = useMemo(() => canSubmit && requestActive, [canSubmit, requestActive]);
  const restartSignInUrl = useMemo(() => {
    const nextPath = `/app/mcp/authorize?request_id=${encodeURIComponent(requestId)}`;
    return `/api/v1/mcp-auth/identity/google/start?next=${encodeURIComponent(nextPath)}`;
  }, [requestId]);
  const logoutUrl = useMemo(() => "/api/v1/mcp-auth/identity/logout", []);
  const expiresAtLabel = useMemo(() => {
    if (!expiresAtIso) return "";
    const parsed = new Date(expiresAtIso);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleString();
  }, [expiresAtIso]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!canSubmit) {
        setNeedsSignIn(false);
        setError("Missing request_id. Restart authorization from your MCP client.");
        setLoadingContext(false);
        return;
      }

      setLoadingContext(true);
      setError("");
      setInfo(signedOut ? "Signed out of MCP authorization session." : "");
      try {
        const session = await fetchMcpSessionMe();
        if (!active) return;
        if (!session.authenticated) {
          setNeedsSignIn(true);
          setError("Sign in is required to continue MCP authorization.");
          setLoadingContext(false);
          return;
        }
        const context = await fetchMcpAuthorizeRequestContext(requestId);
        if (!active) return;
        setClientId(context.client_id);
        setClientName(context.client_name || "");
        setScopes(context.scopes || []);
        setRequestStatus(context.status || "");
        setLinkedAccountId(context.linked_account_id || "");
        setPhoneLast4(context.phone_last4 || "");
        setExpiresAtIso(context.expires_at || null);
        setNeedsSignIn(false);
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Failed to load authorization context.";
        setError(message);
        if (message.toLowerCase().includes("sign-in") || message.toLowerCase().includes("unauth")) {
          setNeedsSignIn(true);
        }
      } finally {
        if (active) setLoadingContext(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [canSubmit, requestId]);

  const handleRequestOtp = async () => {
    if (!canSubmit) return;
    if (!requestActive) {
      setError("Authorization request is not active. Restart from your MCP client.");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Enter your Blinkit phone number first.");
      return;
    }
    setError("");
    setInfo("");
    setLinking("request");
    try {
      const result = await requestMcpLinkOtp(requestId, phoneNumber.trim());
      const data = result.data || {};
      if (data.account_id) {
        setLinkedAccountId(data.account_id);
        setInfo("Blinkit account already linked and active.");
      } else if (data.link_id) {
        setLinkId(data.link_id);
        setInfo("OTP sent. Enter OTP to verify your Blinkit account.");
      } else {
        setInfo(result.message || "OTP request submitted.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request OTP.");
    } finally {
      setLinking(null);
    }
  };

  const handleVerifyOtp = async () => {
    if (!canSubmit) return;
    if (!requestActive) {
      setError("Authorization request is not active. Restart from your MCP client.");
      return;
    }
    if (!linkId.trim()) {
      setError("Missing link_id. Request OTP again.");
      return;
    }
    if (!otp.trim()) {
      setError("Enter OTP to continue.");
      return;
    }
    setError("");
    setInfo("");
    setLinking("verify");
    try {
      const result = await verifyMcpLinkOtp(requestId, linkId.trim(), otp.trim());
      const data = result.data || {};
      if (data.account_id) {
        setLinkedAccountId(data.account_id);
        setInfo("Blinkit account linked successfully.");
      } else {
        setInfo(result.message || "OTP verified.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP.");
    } finally {
      setLinking(null);
    }
  };

  const handleDecision = async (approve: boolean) => {
    if (!canSubmit) {
      setError("Missing request_id. Please restart MCP authorization from your client.");
      return;
    }
    if (!requestActive) {
      setError("Authorization request is no longer active. Restart from your MCP client.");
      return;
    }
    if (approve && !canAllow) {
      setError("Please link your Blinkit account before allowing access.");
      return;
    }
    setError("");
    setSubmitting(approve ? "allow" : "deny");
    try {
      const response = await submitMcpAuthorizationDecision(requestId, approve);
      setRedirectUri(response.redirect_uri);

      // Try to redirect automatically
      setInfo("Authorization complete. Opening VS Code...");
      window.location.assign(response.redirect_uri);

      // Show fallback after 2 seconds (if redirect didn't work)
      setTimeout(() => {
        setInfo(
          "✅ Authorization approved!\n\n" +
          "If VS Code didn't open automatically, copy the URL below and run:\n" +
          '"BetterMeals: Handle OAuth Callback (Manual)" in VS Code Command Palette'
        );
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete authorization.");
      setSubmitting(null);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">BetterMeals MCP</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Authorize MCP Client</h1>
          <p className="text-sm text-gray-500 mt-2">
            This MCP client is requesting permission to access your BetterMeals-linked ordering account.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-400 mb-1">Authorization request ID</p>
          <p className="text-sm font-mono text-gray-700 break-all">{requestId || "missing"}</p>
          {clientId ? (
            <p className="text-xs text-gray-500 mt-2">
              client: {clientName ? `${clientName} (${clientId})` : clientId}
            </p>
          ) : null}
          {requestStatus ? <p className="text-xs text-gray-500 mt-1">status: {requestStatus}</p> : null}
          {expiresAtLabel ? <p className="text-xs text-gray-500 mt-1">expires: {expiresAtLabel}</p> : null}
        </div>

        {scopes.length ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
            <p className="text-sm font-medium text-gray-800">Requested permissions</p>
            <div className="space-y-1">
              {scopes.map((scope) => (
                <div key={scope} className="text-sm text-gray-600">
                  <span className="font-mono text-xs text-gray-500 mr-2">{scope}</span>
                  {describeScope(scope)}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
          <p className="text-sm font-medium text-gray-800">Link Blinkit account</p>
          {loadingContext ? (
            <p className="text-sm text-gray-500">Loading request details...</p>
          ) : needsSignIn ? (
            <p className="text-sm text-gray-600">
              Sign in for MCP authorization, then continue with OTP linking.
            </p>
          ) : !requestActive ? (
            <p className="text-sm text-gray-600">
              This authorization request is no longer active. Restart from your MCP client.
            </p>
          ) : linkedAccountId ? (
            <p className="text-sm text-green-700">
              Linked account: {linkedAccountId}
              {phoneLast4 ? ` (••••${phoneLast4})` : ""}
            </p>
          ) : (
            <>
              <Input
                placeholder="Phone number (e.g. 9639293454)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="h-10"
                disabled={linking !== null}
                onClick={handleRequestOtp}
              >
                {linking === "request" ? "Sending OTP..." : "Send OTP"}
              </Button>
              {linkId ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10"
                    disabled={linking !== null}
                    onClick={handleVerifyOtp}
                  >
                    {linking === "verify" ? "Verifying OTP..." : "Verify OTP"}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>

        {info ? (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 space-y-3">
            <p className="text-sm text-green-700 whitespace-pre-line">{info}</p>
            {redirectUri ? (
              <>
                <div className="rounded bg-white border border-green-200 p-2">
                  <code className="text-xs text-gray-700 break-all">{redirectUri}</code>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(redirectUri);
                    setInfo(info + "\n\n📋 URL copied to clipboard!");
                  }}
                >
                  📋 Copy URL
                </Button>
              </>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
            {needsSignIn || error.toLowerCase().includes("sign-in") || error.toLowerCase().includes("unauth") ? (
              <div className="mt-2">
                <a href={restartSignInUrl} className="underline font-medium text-red-800">
                  Sign in for MCP authorization
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
            disabled={submitting !== null || !canDeny}
            onClick={() => handleDecision(false)}
          >
            {submitting === "deny" ? "Denying..." : "Deny"}
          </Button>
          <Button
            type="button"
            className="flex-1 h-11 text-white font-medium"
            style={{ backgroundColor: "#51754f" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a6b46")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#51754f")}
            disabled={submitting !== null || !canAllow}
            onClick={() => handleDecision(true)}
          >
            {submitting === "allow" ? "Allowing..." : "Allow"}
          </Button>
        </div>

        <div className="pt-2 text-xs text-gray-500 flex items-center justify-between">
          <a href={restartSignInUrl} className="underline">
            Restart sign-in
          </a>
          <a href={logoutUrl} className="underline">
            Sign out MCP session
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
