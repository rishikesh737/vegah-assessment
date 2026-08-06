/**
 * API Version
 */
export const API_VERSION = 'v1';

/**
 * Default pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Token expiration times (in seconds)
 */
export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: 15 * 60, // 15 minutes
  REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days
  PASSWORD_RESET: 60 * 60, // 1 hour
  EMAIL_VERIFICATION: 24 * 60 * 60, // 24 hours
} as const;

/**
 * Rate limiting defaults
 */
export const RATE_LIMIT = {
  DEFAULT_TTL: 60, // seconds
  DEFAULT_LIMIT: 100, // requests per TTL
  AUTH_LIMIT: 5, // login attempts per TTL
} as const;

/**
 * Cache TTL (in seconds)
 */
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  // Auth errors
  INVALID_CREDENTIALS: 'AUTH_001',
  TOKEN_EXPIRED: 'AUTH_002',
  TOKEN_INVALID: 'AUTH_003',
  REFRESH_TOKEN_INVALID: 'AUTH_004',
  UNAUTHORIZED: 'AUTH_005',

  // User errors
  USER_NOT_FOUND: 'USER_001',
  USER_ALREADY_EXISTS: 'USER_002',
  USER_INACTIVE: 'USER_003',

  // Validation errors
  VALIDATION_ERROR: 'VAL_001',
  INVALID_INPUT: 'VAL_002',

  // General errors
  NOT_FOUND: 'ERR_001',
  INTERNAL_ERROR: 'ERR_002',
  RATE_LIMITED: 'ERR_003',
} as const;
