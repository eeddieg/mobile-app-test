import { Router } from "express";
import WpController from "@/controllers/wp.controller";

const wpRouter = Router();

wpRouter.get("/get-contents", WpController.retrieveContentTest);


export default wpRouter;