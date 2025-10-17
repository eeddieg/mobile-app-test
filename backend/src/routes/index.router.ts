import { NextFunction, Request, Response, Router } from "express";
// import createHttpError from "http-errors";
import utilsRouter from "./utils.router";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const message = {
    message: "Welcome to API",
    version: "1.0",
    date: new Date().toISOString(),
  };
  res.status(200).json(message);
});

router.use("/utils", utilsRouter);

router.use(async (req: Request, res: Response, next: NextFunction) => {
  // next(createHttpError.NotFound('Route not Found'))
    res.status(404).json({
      code: 404,
      message: "Route not Found",
  })
});

router.use((err: any, req: Request, res: Response) => {
  res.status(err.status || 500).json({
      status: false,
      code: err.status || 500,
      message: err.message
  })
})

export default router;