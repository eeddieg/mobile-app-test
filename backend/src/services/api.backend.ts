import axios from "axios";
import env from "@/config/env";
import dotenv from "dotenv";

let Axios: ReturnType<typeof axios.create>;

try {
  if (!env.BACKEND_SERVER_BASE_URL || !env.PORT || !env.BASE_API_URL) {
    throw new Error("Server instance variable are missing in environment variables");
  }

  const baseUrl = env.BACKEND_SERVER_BASE_URL;
  const port = env.PORT;
  const apiEndpoint = env.BASE_API_URL;
  const url = baseUrl + ":" + port + "/" + apiEndpoint;

  const headers = {
    "Content-Type": "application/json",
  };
  
  Axios = axios.create({
    baseURL: url,
    headers,
  });
  
} catch (error) {
  console.error("Failed to initialize server instance:", error);
  throw error;
}


export default Axios;