import express, { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { json } from "body-parser";

dotenv.config();

const checkAuth = (req: Request, res: Response, next: Function) => {
  const token = req.cookies.token;
  try {
    const decode = jwt.verify(token, process.env.TOKEN_SECRET as Secret);
    console.log(decode);
    if (!token) {
      res.status(401).json("Unauthorized");
    }
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
