import test, { expect } from "../lambdatest-setup";

test.describe("Drag & Drop Sliders", () => {
  test("should drag slider from default 15 to 95", async ({ page }) => {
    // Step 1: Open the Selenium Playground page
    await page.goto("https://www.testmuai.com/selenium-playground/");

    //Ensure all elements are fully loaded 
    await page.waitForLoadState('networkidle');

    // Click "Drag & Drop Sliders" (using text locator)
    await page.getByText("Drag & Drop Sliders").click();

    // Step 2: Locate the slider with "Default value 15"
    const sliderContainer = page.locator("//h4[contains(text(),'Default value 15')]/following-sibling::div");
    const slider = sliderContainer.locator("input[type='range']");
    const rangeValue = sliderContainer.locator("output");

    // Verify the default value is 15
    await expect(rangeValue).toHaveText("15");

    // Drag the slider to make it 95.
    // We use a bounding-box approach to calculate the target position.
    const sliderBoundingBox = await slider.boundingBox();
    if (!sliderBoundingBox) throw new Error("Slider bounding box not found");

    const { x, y, width, height } = sliderBoundingBox;
    const startX = x + width * 0.15; // approximate position for value 15 on a 0-100 range
    const targetX = x + width * 0.95; // approximate position for value 95
    const centerY = y + height / 2;

    // Click at the starting position, then drag to the target
    await page.mouse.click(startX, centerY);
    await page.mouse.down();
    // Move in incremental steps for reliability
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      const currentX = startX + ((targetX - startX) * i) / steps;
      await page.mouse.move(currentX, centerY);
    }
    await page.mouse.up();

    // If the value isn't exactly 95, fine-tune with keyboard arrows
    let currentValue = parseInt((await rangeValue.textContent()) || "0");
    const maxAttempts = 100;
    let attempts = 0;

    while (currentValue !== 95 && attempts < maxAttempts) {
      await slider.focus();
      if (currentValue < 95) {
        await page.keyboard.press("ArrowRight");
      } else {
        await page.keyboard.press("ArrowLeft");
      }
      currentValue = parseInt((await rangeValue.textContent()) || "0");
      attempts++;
    }

    // Validate the range value shows 95
    await expect(rangeValue).toHaveText("95");
  });
});
