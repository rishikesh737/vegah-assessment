import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@starter/shared';

export const ROLES_KEY = 'roles';

/**
 * Decorator to restrict access to specific user roles
 *
 * @example
 * ```typescript
 * @Roles(UserRole.ADMIN)
 * @Get('admin-only')
 * adminOnly() {
 *   return 'Admin access only';
 * }
 *
 * @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 * @Delete('delete-user')
 * deleteUser() {
 *   return 'Deleted';
 * }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
