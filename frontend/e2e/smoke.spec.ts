import { test, expect } from "@playwright/test";

/**
 * Smoke tests for the BookFactory frontend in demo mode (VITE_DEMO=true).
 *
 * The frontend uses a mock WebSocket in demo mode, so no backend is required.
 * These tests verify that all major routes render without JavaScript errors
 * and that key structural elements are present.
 */

test.describe("Page structure", () => {
  test("home page loads and has navigational structure", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // No unhandled JS errors
    expect(errors.filter((e) => !e.includes("WebSocket"))).toHaveLength(0);

    // Root element rendered (React mounted)
    await expect(page.locator("#root")).not.toBeEmpty();
  });

  test("/demo route renders without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    expect(errors.filter((e) => !e.includes("WebSocket"))).toHaveLength(0);
    await expect(page.locator("#root")).not.toBeEmpty();
  });

  test("/agents route renders without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    expect(errors.filter((e) => !e.includes("WebSocket"))).toHaveLength(0);
    await expect(page.locator("#root")).not.toBeEmpty();
  });

  test("/runs route renders without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/runs");
    await page.waitForLoadState("networkidle");

    expect(errors.filter((e) => !e.includes("WebSocket"))).toHaveLength(0);
    await expect(page.locator("#root")).not.toBeEmpty();
  });

  test("/settings route renders without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    expect(errors.filter((e) => !e.includes("WebSocket"))).toHaveLength(0);
    await expect(page.locator("#root")).not.toBeEmpty();
  });
});

test.describe("Navigation", () => {
  test("navigating between routes does not cause errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to agents
    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    // Navigate to runs
    await page.goto("/runs");
    await page.waitForLoadState("networkidle");

    // Back to home
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors.filter((e) => !e.includes("WebSocket"))).toHaveLength(0);
  });
});

test.describe("404 handling", () => {
  test("unknown routes render without a blank page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await page.waitForLoadState("networkidle");
    // The app should render something (not a blank white page)
    await expect(page.locator("#root")).not.toBeEmpty();
  });
});
