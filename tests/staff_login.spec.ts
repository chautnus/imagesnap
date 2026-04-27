import { test, expect } from '@playwright/test';

test.describe('Staff Authentication Flow', () => {
  test('should allow staff to login with credentials', async ({ page }) => {
    // 1. Go to landing page with staff hash
    await page.goto('/#staff');

    // 2. Check if Staff Login card is visible
    await expect(page.locator('h1')).toContainText('Staff Access');

    // 3. Fill in credentials (assuming nv01 / 123456 exists in mock DB)
    await page.fill('input[placeholder="Staff ID"]', 'nv01');
    await page.fill('input[placeholder="••••••••"]', '123456');

    // 4. Submit form
    await page.click('button[type="submit"]');

    // 5. Verify redirect to App view
    // Since we use mock server, we check if the sidebar appears
    await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });
    
    // 6. Check if capture tab is active
    await expect(page.locator('h3')).toContainText('MANUAL_SNAP');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/#staff');
    await page.fill('input[placeholder="Staff ID"]', 'wrong_user');
    await page.fill('input[placeholder="••••••••"]', 'wrong_pass');
    await page.click('button[type="submit"]');

    const errorMsg = page.locator('.bg-red-500\\/10');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Invalid credentials');
  });
});
