import { env } from "cloudflare:workers";
import { applyD1Migrations } from "cloudflare:test";
import migrationOne from "../migrations/0001_initial.sql?raw";
import migrationTwo from "../migrations/0002_security_corrections.sql?raw";
import migrationThree from "../migrations/0003_moderation_operation_tokens.sql?raw";
import migrationFour from "../migrations/0004_case_retention.sql?raw";
import migrationFive from "../migrations/0005_aggregate_download_formats.sql?raw";

// Keep trigger bodies together; D1's migration helper executes one statement at a time.
const split = (sql: string): string[] => sql.split(/;\s*(?=(?:PRAGMA|CREATE|INSERT|DROP|ALTER|UPDATE|$))/i).map((query) => query.trim()).filter(Boolean);
await applyD1Migrations(env.DB, [
  { name: "0001_initial.sql", queries: split(migrationOne) },
  { name: "0002_security_corrections.sql", queries: split(migrationTwo) },
  { name: "0003_moderation_operation_tokens.sql", queries: split(migrationThree) },
  { name: "0004_case_retention.sql", queries: split(migrationFour) },
  { name: "0005_aggregate_download_formats.sql", queries: split(migrationFive) },
]);
