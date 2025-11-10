// src/config/env.ts
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { z } from "zod";
import Color from "./color.cli";

type Environment = "development" | "production" | "test";

// Determine which environment file to load
const nodeEnv = (process.env.NODE_ENV as Environment) || "development";
const port = parseInt(process.env.PORT ?? "3000", 10);

// Define file paths
const baseEnvPath = path.resolve(process.cwd(), `.env.production`);
const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
const localEnvPath = path.resolve(process.cwd(), `.env.local`);

// Load environment files in order of priority
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`Loaded ${Color.Bright}${Color.FgMagenta}${nodeEnv}${Color.Reset} environment from ${Color.Bright}${Color.FgGreen}${envPath}${Color.Reset}`);
} else if (fs.existsSync(baseEnvPath)) {
  dotenv.config({ path: baseEnvPath });
  console.log(`Loaded ${Color.Bright}${Color.FgMagenta}default${Color.Reset} environment from ${Color.Bright}${Color.FgGreen}${baseEnvPath}${Color.Reset}`);
}

console.log(`Running in ${Color.Bright}${Color.FgBlue}${nodeEnv}${Color.Reset} mode`);

// Load local overrides last
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true });
  console.log(`Loaded local overrides from ${localEnvPath}`);
}

// Define schema for required environment variables
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BASE_API_URL: z.string().min(1, "BASE_API_URL is not set"),
  PDF_URL: z.string().min(1, "PDF_URL is not set"),
  PORT: z.coerce.number().default(port),
});

// Parse and validate
const env = EnvSchema.parse(process.env);

export default env;
