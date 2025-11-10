import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import handleError from "./middleware/error.middleware";
import logger from "./middleware/logger.middleware";
import router from "./routes/index.router";
import env from "./config/env";
import Color from "./config/color.cli";

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(handleError);

const baseApiUrl = "/" + env.BASE_API_URL
app.use(baseApiUrl, router);

try {
  app.listen(env.PORT, () => {
    console.log(`API Server started on ${Color.Bright}${Color.FgYellow}http://localhost:${env.PORT}${baseApiUrl}${Color.Reset}`);
  })
} catch(err) {
    console.log("API Server failed to start.");
    console.log(err);

}