import { describe, it, expect } from 'vitest';
import { Role } from '@prisma/client';
import {
  isEditor,
  isAdmin,
  canManageStories,
  canManageUsers,
  canManageAds,
  canManageSettings,
} from '@/lib/roles';

describe('Role Helpers Unit Tests', () => {
  it('identifies EDITOR permissions correctly', () => {
    expect(isEditor(Role.EDITOR)).toBe(true);
    expect(isEditor(Role.ADMIN)).toBe(true);
    expect(isEditor(null)).toBe(false);

    expect(canManageStories(Role.EDITOR)).toBe(true);
    expect(canManageUsers(Role.EDITOR)).toBe(false);
    expect(canManageAds(Role.EDITOR)).toBe(false);
    expect(canManageSettings(Role.EDITOR)).toBe(false);
  });

  it('identifies ADMIN permissions correctly', () => {
    expect(isAdmin(Role.ADMIN)).toBe(true);
    expect(isAdmin(Role.EDITOR)).toBe(false);

    expect(canManageStories(Role.ADMIN)).toBe(true);
    expect(canManageUsers(Role.ADMIN)).toBe(true);
    expect(canManageAds(Role.ADMIN)).toBe(true);
    expect(canManageSettings(Role.ADMIN)).toBe(true);
  });
});
