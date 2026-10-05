import { Role } from '@prisma/client';

export function isEditor(role: Role | undefined | null): boolean {
  return role === Role.EDITOR || role === Role.ADMIN;
}

export function isAdmin(role: Role | undefined | null): boolean {
  return role === Role.ADMIN;
}

export function canManageStories(role: Role | undefined | null): boolean {
  return isEditor(role);
}

export function canModerateComments(role: Role | undefined | null): boolean {
  return isEditor(role);
}

export function canModerateSubmissions(role: Role | undefined | null): boolean {
  return isEditor(role);
}

export function canManageUsers(role: Role | undefined | null): boolean {
  return isAdmin(role);
}

export function canManageAds(role: Role | undefined | null): boolean {
  return isAdmin(role);
}

export function canManageSettings(role: Role | undefined | null): boolean {
  return isAdmin(role);
}

export function canViewAuditLogs(role: Role | undefined | null): boolean {
  return isAdmin(role);
}
