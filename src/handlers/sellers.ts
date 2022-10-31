import express, { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { authorization } from "../middleware/authorization";
import checkAuth from "../middleware/auth";
import { checkEmailAndPassword } from "../middleware/validation";
import { seller, sellers } from "../models/Sellers";
import { createAccountValidation } from "../validationSchema/createAccount";
import { sellerValidation } from "../validationSchema/sellerAccount";

const store = new sellers();
const auth = new authorization();

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
    seller_email: req.body.email,
    seller_password: req.body.password,
    shop_name: req.body.shop_name,
    role_id: 2,
  };

  try {
    //check shop name
    const shopNameCheck = await store.checkShopName(sellers.shop_name);
    if (shopNameCheck) {
      return res.status(400).json("Shop name already exists");
    }
    const checkEmail = await store.checkEmail(sellers.seller_email);
    if (!checkEmail) {
      const newSeller = await store.createSeller(sellers);
      sellers.seller_id = newSeller.seller_id;
      var token = jwt.sign(sellers, process.env.TOKEN_SECRET as Secret, {
        expiresIn: "1d",
      });
      console.log(sellers.role_id);
      res.json("token");
    } else res.status(400).json("an Email already exists!");
    return;
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

      var token = jwt.sign(loginSeller, process.env.TOKEN_SECRET as Secret, {
        expiresIn: "2h",
      });

      res.cookie("token", token, {
        maxAge: 2 * 60 * 60 * 1000,
        // httpOnly: true,
      });

      res.json(token);
      return;
    }
    res.status(400).json("Invalid Email or Password");
    return;
  } catch (error) {
    throw new Error("An Error occured while logging in" + error);
  }
};
const deleteSeller = async (req: Request, res: Response) => {
  try {
    const allCustomers = await store.deleteSeller(
      req.params.id as unknown as number
    );
    res.json(allCustomers);
  } catch (err) {
    throw new Error(`An Error occured retriving customers: ${err}`);
  }
};
const seller_route = (app: express.Application) => {
  app.get("/sellers", checkAuth, auth.adminRole, getAllSellers);
  app.get("/sellers/:id", getSellerWithId);
  app.post(
    "/sellers",
    createAccountValidation,
    sellerValidation,
    checkEmailAndPassword,
    createSeller
  );
  app.post("/auth/seller", authenticate);
  app.delete("/seller/delete/:id", checkAuth, auth.adminRole, deleteSeller);
};

export default seller_route;
