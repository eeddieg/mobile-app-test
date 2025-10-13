import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";
// import { User } from "../model/user.model";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as jwt.Secret;

class JwtToken {
  // static signAccessToken(payload: Object | User) {
  static signAccessToken(payload: Object) {
    return new Promise((resolve, reject) => {
      jwt.sign({ payload }, accessTokenSecret, {}, (err, token) => {
        if (err) {
          reject(createHttpError.InternalServerError());
        }
        resolve(token);
      });
    });
  };

  static verifyAccessToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, accessTokenSecret, (err, payload) => {
        if (err) {
          const message =
            err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
          return reject(createHttpError.Unauthorized(message));
        }
        resolve(payload);
      });
    });
  };

}

export default JwtToken;