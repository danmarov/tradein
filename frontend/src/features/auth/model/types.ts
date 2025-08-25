import type { UserProfile } from "@/entities/user/model";
import type { ApiError } from "@/entities/shared/model";

export interface LoginRequest {
  steam_id: string;
  steam_ticket: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: ApiError | null;
  needsCookieUpdate?: {
    access_token: string;
    refresh_token: string;
  };
}

export interface StoredTokens {
  access_token: string;
  refresh_token: string;
}

export interface JWTPayload {
  id: string;
  steam_id: string;
  type?: "refresh";
  iat: number;
  exp: number;
}

export interface SteamAuthParams {
  openid_mode: string;
  openid_ns: string;
  openid_return_to: string;
  openid_realm: string;
  openid_identity: string;
  openid_claimed_id: string;
  openid_assoc_handle: string;
  openid_signed: string;
  openid_sig: string;
}

export type AuthErrorCode =
  | "INVALID_STEAM_TICKET"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "STEAM_AUTH_FAILED"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR"
  | "LOGIN_ERROR"
  | "LOGOUT_ERROR";

export interface AuthError extends ApiError {
  code: AuthErrorCode;
}

export type AuthEvent =
  | "login_attempt"
  | "login_success"
  | "login_failure"
  | "token_refresh"
  | "logout"
  | "session_expired";

export interface AuthEventData {
  event: AuthEvent;
  user_id?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
