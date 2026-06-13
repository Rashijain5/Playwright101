import test, { expect } from "../lambdatest-setup";

test.describe("Input Form Submit", () => {
  test("should validate form submission with all fields", async ({ page }) => {
    // Step 1: Open the Selenium Playground page and click "Input Form Submit"
    await page.goto("https://www.testmuai.com/selenium-playground/");
    await page.getByText("Input Form Submit").click();

    // Step 2: Click "Submit" without filling in any information
    await page.getByRole("button",{name:"Submit"}).click();

    // Step 3: Assert "Please fill in the fields" error message
    const msg = page.locator("#name");
    await expect(msg).toHaveAttribute('required','');

    //Ensure all elements are fully loaded 
    await page.waitForLoadState('networkidle');

    // Step 4 & 5 & 6: Fill in all fields
    await page.locator('#name').fill('Steve');

    // Using Email (using label)
    await page.getByLabel('Email').fill('Steve46@email.com');

    // Password (using label/placeholder)
    await page.getByPlaceholder("Password").fill("Secure123!");

    // Company
    await page.getByPlaceholder("Company").fill("TestMu AI Corp");

    // Website
    await page.getByPlaceholder("Website").fill("https://www.testmuai.com");

    // Step 5: Select "United States" from the Country drop-down using text property
    await page.locator('select[name="country"]').selectOption({label: 'United States'});

    // City
    await page.getByPlaceholder("City").fill("New York");

    // Address 1
    await page.locator('#inputAddress1').fill('Wall Street');

    // Address 2
    await page.getByPlaceholder("Address 2").fill('Dno:10-105');

    // State
    await page.locator('input[id="inputState"]').fill('NY');

    // Zip Code
    await page.getByPlaceholder("Zip code").fill("3456");

    // Step 6: Click "Submit"
    await page.getByRole("button", { name: "Submit" }).click();

    // Step 7: Validate the success message
    const successMessage = page.locator(".success-msg");
    await expect(successMessage).toContainText("Thanks for contacting us, we will get back to you shortly.");
  });
});
