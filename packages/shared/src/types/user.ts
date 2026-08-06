/**
 * User roles in the system
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

/**
 * User status
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

/**
 * Base user type (public fields)
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User with sensitive fields (for internal use)
 */
export interface UserWithPassword extends User {
  password: string;
  refreshToken?: string;
}

/**
 * Create user payload
 */
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Update user payload
 */
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

/**
 * User profile response
 */
export interface UserProfile extends User {
  fullName: string;
}

/**
 * User list item (for admin views)
 */
export interface UserListItem {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
