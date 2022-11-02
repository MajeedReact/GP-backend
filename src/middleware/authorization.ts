import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { customer } from "../models/customers";

export class authorization {
  //posting product
  checkSellerOrAdmin(req: Request, res: Response, next: Function) {
    try {
      var token = req.cookies.token;
      var result = jwt.decode(token) as customer;
      
      if (result.role_id == 2 || result.role_id == 3) {
        next();
      } else {
        res.json("You are not a seller nor an admin");
        return;
      }
    } catch (error) {
      throw new Error("An Error occured " + error);
    }
  }

  //admin role only
  adminRole(req: Request, res: Response, next: Function) {
    var token = req.cookies.token;
    var result = jwt.decode(token) as customer;

    if (result.role_id == 3) {
      next();
    } else {
      res.json("Unauthorized");
      return;
    }
  }

  isCustomer(req: Request, res: Response, next: Function) {
    const token = req.cookies.token;
    var decode = jwt.decode(token) as customer;

    //check if user
    if (decode.role_id == 1 || decode.role_id == 3) {
      next();
    } else {
      res.status(403);
      res.json("Forbidden");
    }
  }
}
