import { test, expect } from '@playwright/test';

test.describe('18+ Age Gate & Compliance', () => {
  test('no cookie -> shows age gate modal overlay', async ({ page }) => {
    await page.goto('/');
    const gateModal = page.locator('[role="dialog"]');
    await expect(gateModal).toBeVisible();
    await expect(page.locator('text=18+ Adults Only')).toBeVisible();
    await expect(page.locator('text=हाँ, प्रवेश करें')).toBeVisible();
    await expect(page.locator('text=नहीं, बाहर जाएं')).toBeVisible();
  });

  test('clicking No -> redirects to /access-denied and blocks re-entry', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("नहीं, बाहर जाएं")');
    await page.waitForURL('**/access-denied');
    await expect(page.locator('text=प्रवेश वर्जित (Access Denied)')).toBeVisible();
    await expect(page.locator('a[href="https://www.google.com"]')).toBeVisible();

    // Try going back to home page - should be redirected back to access-denied
    await page.goto('/');
    await page.waitForURL('**/access-denied');
  });

  test('disclaimer and content policy pages exist and are accessible', async ({ page }) => {
    await page.goto('/disclaimer');
    await expect(page.locator('h1')).toContainText('अस्वीकरण');
    await expect(page.locator('text=केवल वयस्क पाठकों के लिए')).toBeVisible();

    await page.goto('/content-policy');
    await expect(page.locator('h1')).toContainText('सामग्री नीति');
    await expect(page.locator('text=पूर्णतः प्रतिबंधित सामग्री')).toBeVisible();
  });
});
