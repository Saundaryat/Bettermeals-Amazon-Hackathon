import { api } from "@/lib/httpClient";

export interface McpAuthorizationDecisionResponse {
  success: boolean;
  approved: boolean;
  redirect_uri: string;
}

export interface McpAuthorizeRequestContext {
  request_id: string;
  client_id: string;
  client_name?: string;
  scopes: string[];
  status: string;
  linked_account_id?: string;
  phone_last4?: string;
  expires_at?: string | null;
}

export interface McpSessionMeResponse {
  authenticated: boolean;
  principal_id?: string;
}

export interface McpGrantRequestContext {
  request_id: string;
  account_id: string;
  org_id: string;
  requested_scopes: string[];
  requested_ttl_days?: number;
  status?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface McpGrantEnvelope {
  status?: string;
  state?: string;
  message?: string;
  data?: any;
  errors?: Array<{ code?: string; message?: string }>;
}

export interface McpGrantRequestsListEnvelope {
  status?: string;
  state?: string;
  message?: string;
  data?: {
    account_id?: string;
    grant_requests?: McpGrantRequestContext[];
  };
  errors?: Array<{ code?: string; message?: string }>;
}

export interface McpLinkRequestOtpResult {
  status?: string;
  message?: string;
  data?: {
    link_id?: string;
    account_id?: string;
    phone_last4?: string;
    already_logged_in?: boolean;
  };
}

export interface McpLinkVerifyOtpResult {
  status?: string;
  message?: string;
  data?: {
    account_id?: string;
    phone_last4?: string;
    link_id?: string;
  };
}

export async function fetchMcpAuthorizeRequestContext(
  requestId: string
): Promise<McpAuthorizeRequestContext> {
  const result = await api.get<McpAuthorizeRequestContext>(
    `/mcp-auth/authorize/request?request_id=${encodeURIComponent(requestId)}`,
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to load authorization request.");
  }
  return result.data;
}

export async function fetchMcpSessionMe(): Promise<McpSessionMeResponse> {
  const result = await api.get<McpSessionMeResponse>("/mcp-auth/session/me", {
    requireAuth: false,
  });
  if (!result.success || !result.data) {
    return { authenticated: false };
  }
  return result.data;
}

export async function requestMcpLinkOtp(
  requestId: string,
  phoneNumber: string
): Promise<McpLinkRequestOtpResult> {
  const result = await api.post<McpLinkRequestOtpResult>(
    "/mcp-auth/authorize/link/request-otp",
    {
      request_id: requestId,
      phone_number: phoneNumber,
    },
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to request OTP.");
  }
  return result.data;
}

export async function verifyMcpLinkOtp(
  requestId: string,
  linkId: string,
  otp: string
): Promise<McpLinkVerifyOtpResult> {
  const result = await api.post<McpLinkVerifyOtpResult>(
    "/mcp-auth/authorize/link/verify-otp",
    {
      request_id: requestId,
      link_id: linkId,
      otp,
    },
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to verify OTP.");
  }
  return result.data;
}

export async function submitMcpAuthorizationDecision(
  requestId: string,
  approve: boolean
): Promise<McpAuthorizationDecisionResponse> {
  const result = await api.post<McpAuthorizationDecisionResponse>(
    "/mcp-auth/authorize/decision",
    {
      request_id: requestId,
      approve,
    },
    {
      requireAuth: false,
    }
  );

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to submit authorization decision.");
  }

  return result.data;
}

export async function createMcpGrantRequest(input: {
  account_id: string;
  org_id: string;
  scopes: string[];
  payment_policy?: Record<string, any>;
  expires_in_days?: number;
}): Promise<McpGrantEnvelope> {
  const result = await api.post<McpGrantEnvelope>(
    "/mcp-auth/grant/request-create",
    input,
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to create grant request.");
  }
  return result.data;
}

export async function fetchMcpGrantRequestContext(
  requestId: string,
  accountId: string
): Promise<McpGrantRequestContext> {
  const result = await api.get<McpGrantRequestContext>(
    `/mcp-auth/grant/request?request_id=${encodeURIComponent(requestId)}&account_id=${encodeURIComponent(accountId)}`,
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to load grant request.");
  }
  return result.data;
}

export async function approveMcpGrantRequest(requestId: string): Promise<McpGrantEnvelope> {
  const result = await api.post<McpGrantEnvelope>(
    "/mcp-auth/grant/approve",
    { request_id: requestId },
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to approve grant request.");
  }
  return result.data;
}

export async function rejectMcpGrantRequest(
  requestId: string,
  reason?: string
): Promise<McpGrantEnvelope> {
  const result = await api.post<McpGrantEnvelope>(
    "/mcp-auth/grant/reject",
    { request_id: requestId, reason },
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to reject grant request.");
  }
  return result.data;
}

export async function revokeMcpGrant(grantId: string): Promise<McpGrantEnvelope> {
  const result = await api.post<McpGrantEnvelope>(
    "/mcp-auth/grant/revoke",
    { grant_id: grantId },
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to revoke grant.");
  }
  return result.data;
}

export async function fetchMcpGrantList(accountId: string): Promise<McpGrantEnvelope> {
  const result = await api.get<McpGrantEnvelope>(
    `/mcp-auth/grant/list?account_id=${encodeURIComponent(accountId)}`,
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to load grant list.");
  }
  return result.data;
}

export async function fetchMcpGrantRequests(
  accountId: string,
  statuses?: string
): Promise<McpGrantRequestsListEnvelope> {
  const query = statuses ? `&statuses=${encodeURIComponent(statuses)}` : "";
  const result = await api.get<McpGrantRequestsListEnvelope>(
    `/mcp-auth/grant/requests?account_id=${encodeURIComponent(accountId)}${query}`,
    { requireAuth: false }
  );
  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to load grant requests.");
  }
  return result.data;
}
