import JwtToken from "../utils/jwt.utils";
import createHttpError = require("http-errors");
import { Request, Response, NextFunction } from "express";

class authMiddleware {
  static auth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      return next(createHttpError.Unauthorized("Access token is required"));
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(createHttpError.Unauthorized());
    }

    await JwtToken.verifyAccessToken(token)
      .then((token) => {
        console.log(token);
        
        req.headers.user = token as string;
        next();
      })
      .catch((e: any) => {
        next(createHttpError.Unauthorized(e.message));
      });
  };
}

export default authMiddleware;