import { Router } from "express";
import WpController from "@/controllers/wp.controller";

const wpRouter = Router();

wpRouter.get("/carousel",       WpController.retrieveCarousel);
wpRouter.get('/clean-page', WpController.retrieveCleanPage);
wpRouter.get("/get-contents",   WpController.retrieveContentTest);
wpRouter.get("/media",          WpController.retrieveMedia)
wpRouter.get("/navigation",     WpController.retrieveNavigation);
wpRouter.get("/pages",          WpController.retrievePages);
wpRouter.get("/pages/:id",      WpController.retrievePageById);
wpRouter.get("/posts",          WpController.retrievePosts);
wpRouter.get('/posts/category', WpController.retrievePostsByCategory)
wpRouter.get('/render',         WpController.retrieveRenderedPage);
wpRouter.get('/styles/:file',   WpController.retrieveStyle);

export default wpRouter;