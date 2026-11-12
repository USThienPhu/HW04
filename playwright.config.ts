import { defineConfig, devices } from '@playwright/test';

const RUN_TIMESTAMP = new Date().toISOString();
const STUDENT_ID = '23120327';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  metadata: {
    runBy: `Run by: ${STUDENT_ID}`,
    studentId: STUDENT_ID,
    timestamp: RUN_TIMESTAMP,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['./reporters/student-audit.reporter.ts'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
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
  ],
});
