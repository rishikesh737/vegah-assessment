import { User } from './user';

/**
 * Login request payload
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Registration request payload
 */
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Auth tokens response
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Login response
 */
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Refresh token request
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * Password reset request
 */
export interface ForgotPasswordDto {
  email: string;
}

/**
 * Reset password with token
 */
export interface ResetPasswordDto {
  token: string;
  password: string;
}

/**
 * Change password (authenticated)
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Decoded access token
 */
export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  issuedAt: Date;
  expiresAt: Date;
}
