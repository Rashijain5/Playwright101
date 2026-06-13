import dotenv from "dotenv";
import { test as base, expect, chromium } from "@playwright/test";
import path from "path";

// Load .env file
dotenv.config();

const buildCapabilities = (projectName: string, testName: string) => {
  // Split project name: "chrome@lambdatest-win10" -> browser: "chrome", OS: "win10"
  const parts = projectName.split("@lambdatest");
  const browserName = parts[0];
  const osPart = parts[1] ? parts[1].replace("-", "") : "";

  // Map OS
  let platform = "Windows 10"; // default
  if (osPart === "win11") platform = "Windows 11";
  if (osPart === "macos") platform = "MacOS Sonoma";

  return {
    browserName: browserName || "chrome",
    browserVersion: "latest",
    "LT:Options": {
      platform: platform,
      build: "Playwright 101 Assignment",
      name: testName,
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      network: true,
      video: true,
      console: true,
      visual: true,
    },
  };
};

const test = base.extend({
  page: async ({ playwright }, use, testInfo) => {
    const fileName = testInfo.file.split(path.sep).pop();
    const isLambdaTest = testInfo.project.name.includes("@lambdatest");

    if (!isLambdaTest) {
      const browser = await playwright.chromium.launch();
      const page = await browser.newPage();
      await use(page);
      await page.close();
      await browser.close();
      return;
    }

    if (!process.env.LT_USERNAME || !process.env.LT_ACCESS_KEY) {
      throw new Error("LT_USERNAME or LT_ACCESS_KEY is missing.");
    }

    const capabilities = buildCapabilities(
      testInfo.project.name,
      `${testInfo.title} - ${fileName}`
    );

    console.log("Connecting to LambdaTest with capabilities:", JSON.stringify(capabilities, null, 2));

    const browser = await chromium.connect(
      `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
        JSON.stringify(capabilities)
      )}`,
      { timeout: 300000 }
    );

    const page = await browser.newPage();

    try {
      await use(page);
    } finally {
      await page.close();
      await browser.close();
    }
  },
});

export default test;
export { expect };