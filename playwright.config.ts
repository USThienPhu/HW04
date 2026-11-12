import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const RUN_TIMESTAMP = new Date().toISOString();
const STUDENT_ID = '23120327';

// Detect --project=<name> and spec file from CLI args so each feature × browser keeps its own report
const projectArg = process.argv.find((arg) => arg.startsWith('--project='));
const runScope = projectArg ? projectArg.split('=')[1] : 'all';

const specArg = process.argv.find((arg) => arg.endsWith('.spec.ts'));
const featureScope = specArg
  ? path.basename(specArg, '.spec.ts').split('-')[0]
  : 'suite';

const htmlOutputFolder =
  process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ||
  `playwright-report/${featureScope}/${runScope}`;
const testOutputDir = `test-results/${featureScope}/${runScope}`;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  outputDir: testOutputDir,
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
    htmlOutputFolder,
    runScope: `${featureScope}/${runScope}`,
  },
  reporter: process.argv.includes('--list')
    ? [['list']]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: htmlOutputFolder }],
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
