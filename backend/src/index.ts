import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import handleError from "./middleware/error.middleware";
import logger from "./middleware/logger.middleware";
import router from "./routes/index.router";

dotenv.config();

const app: Express = express();
const baseUrl = "/" + process.env.BASE_URL as string;
const port = parseInt(process.env.PORT as string, 10) | 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(handleError);

app.use(baseUrl, router);

try {
  app.listen(port, () => {
    console.log(`API Server started on http://localhost:${port}${baseUrl}`);
  })
} catch(err) {
    console.log("API Server failed to start.");
    console.log(err);

}