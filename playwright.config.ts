import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const getLtCapabilities = (browserName: string, version: string, platform: string) => {
  const capabilities = {
    browserName: browserName.toLowerCase(),
    browserVersion: version,
    'LT:Options': {
      platform: platform,
      build: 'Playwright 101 Assignment',
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      network: true,
      video: true,
      console: true,
      visual: true,
    },
  };
  return `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 300_000,
  retries: 0,
  workers: 1,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'https://www.testmuai.com/selenium-playground/',
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 60000,
    actionTimeout: 30000,
  },
 projects: [
  // Local browsers
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },

  // LambdaTest: Chrome on Windows
  {
    name: 'chrome@lambdatest-win10',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'chrome@lambdatest-win11',
    use: { ...devices['Desktop Chrome'] },
  },

  // LambdaTest: Firefox on Windows
  {
    name: 'pw-firefox@lambdatest-win10',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'pw-firefox@lambdatest-win11',
    use: { ...devices['Desktop Firefox'] },
  },
],
});