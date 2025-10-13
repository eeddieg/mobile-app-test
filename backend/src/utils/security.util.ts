import { compareSync, genSaltSync, hashSync } from "bcrypt-nodejs";

export const hashPassword = (password: string) => {
  const saltRounds: number = 10;
  const salt = genSaltSync(saltRounds);
  return hashSync(password, salt);
};

export const validateUser = (
  userPasswordProvided: string,
  storedPassword: string
) => {
  return compareSync(userPasswordProvided, storedPassword);
};