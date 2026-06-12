import { test, expect } from "@playwright/test";

test.describe("Simple Form Demo Validation", () => {
  test("should validate simple form message display", async ({ page }) => {
    // Step 1: Open TestMu AI Selenium Playground
    await page.goto("https://www.testmuai.com/selenium-playground/");

    // Step 2: Click "Simple Form Demo"
    await page.getByText("Simple Form Demo").click();

    // Step 3: Validate that the URL contains "simple-form-demo"
    await expect(page).toHaveURL(/simple-form-demo/);

    // Step 4: Create a variable for a string value
    const msg = "Welcome to TestMu AI";

   //Ensure all elements are fully loaded 
   await page.waitForLoadState("networkidle");

    // Step 5: Enter the message in the "Enter Message" text box
    await page.getByPlaceholder("Please enter your Message").fill(msg);

    // Step 6: Click "Get Checked Value" (using role locator)
    await page.getByRole("button",{name: 'Get Checked Value'}).click();

    // Step 7: Validate the same message is displayed under "Your Message:" section
    await expect(page.locator("#message")).toHaveText(msg);

  });
});