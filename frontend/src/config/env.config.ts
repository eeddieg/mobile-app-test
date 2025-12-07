import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  AXIOS_BASE_URL: z.string().min(1),
});

type Env = z.infer<typeof EnvSchema>;

const env: Env = EnvSchema.parse({
  NODE_ENV: import.meta.env.MODE as Env["NODE_ENV"],
  AXIOS_BASE_URL: import.meta.env.VITE_AXIOS_BASE_URL,
});

export default env;
