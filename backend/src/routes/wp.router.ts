import { Router } from "express";
import WpController from "@/controllers/wp.controller";

const wpRouter = Router();

wpRouter.get("/carousel",     WpController.retrieveCarousel);
wpRouter.get("/get-contents", WpController.retrieveContentTest);
wpRouter.get('/media',        WpController.retrieveMedia)
wpRouter.get("/navigation",   WpController.retrieveNavigation);
wpRouter.get("/pages",        WpController.retrievePages);
wpRouter.get("/pages/:id",    WpController.retrievePageById);
wpRouter.get("/posts",        WpController.retrievePosts);

export default wpRouter;