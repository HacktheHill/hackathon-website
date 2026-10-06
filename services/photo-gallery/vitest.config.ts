import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [cloudflareTest({
    wrangler: { configPath: "./wrangler.test.jsonc" },
    miniflare: {
      bindings: {
        OTP_HMAC_SECRET: "local-test-secret-that-is-long-enough-123456",
        SESSION_HMAC_SECRET: "local-session-secret-that-is-long-enough-123456",
        AWS_ACCESS_KEY_ID: "local-test-access-key",
        AWS_SECRET_ACCESS_KEY: "local-test-secret-key",
      },
    },
  })],
  test: {
    setupFiles: ["./tests/setup.ts"],
  },
});
