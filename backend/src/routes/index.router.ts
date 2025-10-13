import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { Router } from "express";
// import handleError from "../middleware/error.middleware";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json("Welcome to API");
});

router.get("/get-pdf", async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json("Welcome to API");
});


// router.use("/user", userRouter);

router.use(async (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError.NotFound('Route not Found'))
});

router.use( (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
      status: false,
      message: err.message
  })
})

export default router;