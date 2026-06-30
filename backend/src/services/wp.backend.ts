import { Buffer } from "buffer";
import env from "@/config/env";
import axios from "axios";

let wpApi: ReturnType<typeof axios.create>;
let wpApiContents: ReturnType<typeof axios.create>;

try {
  const wpUser = env.WP_USER;
  const wpAppPassword = env.WP_APP_PASSWORD;

  if (!wpUser || !wpAppPassword) {
    throw new Error("WordPress credentials missing in environment variables");
  }

  const authHeader =
    "Basic " + Buffer.from(`${wpUser}:${wpAppPassword}`).toString("base64");

  wpApi = axios.create({
    baseURL: env.WP_BASE,
    // headers: {
    //   Authorization: authHeader,
    // },
  });

  wpApiContents = axios.create({
    baseURL: env.WP_BASE,
    // headers: {
    //   Authorization: authHeader,
    // },
  });

} catch (error) {
  console.error("Failed to initialize WordPress API client:", error);
  throw error;
}
 
export { wpApi, wpApiContents };