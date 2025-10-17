import { Router } from "express";
import UtilsController from "@/controllers/utils.controller";

const utilsRouter = Router();

utilsRouter.get("/get-pdf", UtilsController.retrieveFile);


export default utilsRouter;