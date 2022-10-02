import express, { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { seller, sellers } from "../models/Sellers";
import { registerationException } from "../customException/registeration/registerException";

const store = new sellers();

const getAllSellers = async (_req: Request, res: Response) => {
  try {
    const allSellers = await store.getAllSeller();
    res.json(allSellers);
  } catch (err) {
    throw new Error(`An Error occured retriving roles: ${err}`);
  }
};

const getSellerWithId = async (req: Request, res: Response) => {
  //casting
  const seller = await store.getSellerWithId(
    req.params.id as unknown as number
  );
  res.json(seller);
};

const createSeller = async (req: Request, res: Response) => {
  const sellers: seller = {
    seller_email: req.body.seller_email,
    seller_password: req.body.seller_password,
    shop_name: req.body.shop_name,
    role_id: 2,
  };

  //create password exception
  try {
    if (sellers.seller_password.length < 8) {
      res.json("Invalid Password");
      throw new registerationException("invalid password");
    }
  } catch (error) {
    throw new Error("An error occured " + error);
  }
  //end of Ecxaption

  try {
    const checkEmail = await store.checkEmail(sellers.seller_email);
    if (!checkEmail) {
      const newSeller = await store.createSeller(sellers);
      sellers.seller_id = newSeller.seller_id;
      var token = jwt.sign(sellers, process.env.TOKEN_SECRET as Secret, {
        expiresIn: "1d",
      });
      console.log(sellers.role_id);
      res.json(token);
    } else {

      res.json("an Email already exists!");
      throw new registerationException("an Email already exists!");
      } 
  } catch (err) {
    throw new Error("An error occured while creating the account " + err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const login = await store.loginSeller(req.body.email, req.body.password);
    if (login != null) {
      const loginSeller = {
        shop_name: login.shop_name,
        seller_email: login.seller_email,
        seller_id: login.seller_id,
        role_id: login.role_id,
      };
      console.log(login.shop_name);
      var token = jwt.sign(loginSeller, process.env.TOKEN_SECRET as Secret, {
        expiresIn: "2h",
      });

      res.cookie("token", token, {
        maxAge: 7200,
        // httpOnly: true,
      });
      req.cookies.token;
      res.json(token);
      return;
    }
    res.json("Invalid Email or Password");
    return;
  } catch (error) {
    throw new Error("An Error occured while logging in" + error);
  }
};
const seller_route = (app: express.Application) => {
  app.get("/sellers", getAllSellers);
  app.get("/sellers/:id", getSellerWithId);
  app.post("/sellers", createSeller);
  app.post("/auth/seller", authenticate);
};

export default seller_route;
