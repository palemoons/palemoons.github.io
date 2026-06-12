import { loadEnvConfig } from "@next/env";

let envLoaded = false;

function ensureEnvLoaded() {
  if (envLoaded) return;
  loadEnvConfig(process.cwd());
  envLoaded = true;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (value) return value;

  ensureEnvLoaded();
  const loadedValue = process.env[name];
  if (!loadedValue) throw new Error(`${name} is not defined in environment variables`);
  return loadedValue;
}

export function getPostsDir(): string {
  return getRequiredEnv("POSTS_DIR");
}

export function getSiteUrl(): string {
  const configuredSiteUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSiteUrl) return configuredSiteUrl;

  ensureEnvLoaded();
  return process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "unknown";
}
