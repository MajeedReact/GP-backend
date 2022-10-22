import express, { Request, Response } from "express";
import { customer, customers } from "../models/customers";
import jwt, { Secret } from "jsonwebtoken";
import checkAuth from "../middleware/auth";
import { authorization } from "../middleware/authorization";
import { registerationException } from "../customException/registeration/registerException";
import { loginException } from "../customException/loginException";

const store = new customers();
const auth = new authorization();

require("dotenv").config();

const getAllCustomers = async (res: Response) => {
  try {
    const allCustomers = await store.getAllCustomers();
    res.json(allCustomers);
  } catch (err) {
    throw new Error(`An Error occured retriving customers: ${err}`);
  }
};

const getCustomerWithId = async (req: Request, res: Response) => {
  //casting
  const seller = await store.getCustomerWithId(
    req.params.id as unknown as number
  );
  if (seller != null) res.json(seller);
  else res.json("No user found with that ID");
};
//customer creation
const createCustomer = async (req: Request, res: Response) => {
  const customer: customer = {
    customer_email: req.body.customer_email,
    cus_first_name: req.body.cus_first_name,
    cus_last_name: req.body.cus_last_name,
    customer_password: req.body.customer_password,
    role_id: 1,
  };

  // //create password exception
  // try {
  //   if (customer.customer_password.length < 8) {
  //     res.json("Invalid Password");
  //     throw new InvalidPassword("invalid password");
  //   }
  // } catch (error) {
  //   throw new Error("An error occured " + error);
  // }
  // //end of Ecxaption

  //email check
  try {
    const checkEmail = await store.checkEmail(customer.customer_email);
    if (!checkEmail) {
      const newCustomer = await store.createCustomer(customer);
      customer.customer_id = newCustomer.customer_id;
      var token = jwt.sign(newCustomer, process.env.TOKEN_SECRET as Secret, {
        expiresIn: "1d",
      });
      console.log(newCustomer.customer_id);
      res.json("success");
    } else res.status(400).json("an Email already exists!");
    return;
  } catch (err) {
    throw new Error("An error occured while creating the account " + err);
  }
  //email check
  //end of customer creation
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const login = await store.loginCustomer(req.body.email, req.body.password);
    if (login != null) {
      const loginCustomer = {
        cus_first_eame: login.cus_first_name,
        customer_email: login.customer_email,
        customer_id: login.customer_id,
        role_id: login.role_id,
      };
      console.log(login.cus_first_name);
      var token = jwt.sign(loginCustomer, process.env.TOKEN_SECRET as Secret, {
        expiresIn: "2h",
      });

      res.cookie("token", token, {
        maxAge: 2 * 60 * 60 * 1000,
        // httpOnly: true,
      });
      req.cookies.token;
      res.json(token);
      return;
    }
    res.status(400).json("Invalid Email or Password");
    return;
  } catch (error) {
    throw new Error("An Error occured while logging in" + error);
  }
};

const logout = async (req: Request, res: Response) => {
  //set cookie age to 0 so it gets cleared immediately
  res.cookie("token", "", { maxAge: 0 });
};
const profile = async (req: Request, res: Response) => {
  try {
    var token = req.cookies.token;
    const getCustomer = jwt.decode(token) as customer;
    const customer = await store.getCustomerWithId(
      getCustomer.customer_id as number
    );

    if (customer != null) res.json(customer);
    else res.json("No user found with that ID");
  } catch (error) {
    throw new Error("an error occured " + error);
  }
};

const customer_route = (app: express.Application) => {
  app.get("/customers", checkAuth, auth.adminRole, getAllCustomers);
  app.get("/customer/:id", checkAuth, getCustomerWithId);
  app.post("/customer", createCustomer);
  app.post("/auth/customer", authenticate);
  app.get("/profile", checkAuth, profile);
  app.post("/logout", logout);
};

export default customer_route;
