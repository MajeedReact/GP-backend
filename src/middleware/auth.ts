import express, { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { json } from "body-parser";

dotenv.config();

const checkAuth = (req: Request, res: Response, next: Function) => {
  const token = req.cookies.token;
  console.log(token);
  try {
    //if there is no token
    if (!token) {
      res.status(401).json("Unauthorized");
      return;
    }

    const decode = jwt.verify(token, process.env.TOKEN_SECRET as Secret);

    //if token is invalid
    if (!decode) {
      res.status(401).json("Invalid Token");
      return;
    } else {
      next();
    }
  } catch (err) {
    res.clearCookie("token");
    const error = err;
    throw new Error(error as unknown as string);
  }
};

export default checkAuth;
