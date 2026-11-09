import { defineConfig } from '@playwright/test';

const port = 4399;

export default defineConfig({
  testDir: 'tests',
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${port}/HammerTimeCSS/`,
    colorScheme: 'dark',
    viewport: { width: 1280, height: 900 },
    launchOptions: {
      // Lets a locally installed Chromium be used instead of the one `playwright install` downloads
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    },
  },
  // The tests run against the documentation site, which renders the compiled stylesheet from dist/
  webServer: {
    command: `pnpm build:css && pnpm --dir docs install --frozen-lockfile --ignore-scripts && pnpm --dir docs dev --port ${port} --ignore-lock`,
    url: `http://localhost:${port}/HammerTimeCSS/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
