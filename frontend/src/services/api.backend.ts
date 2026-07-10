import axios from "axios";
import env from "src/config/env.config";

const headers = {
  "Content-Type": "application/json",
};

const Axios = axios.create({
  baseURL: env.AXIOS_BASE_URL,
  headers,
  timeout: 10000,
});

export default Axios;

