import express, { Request, Response } from "express";
import { customer, customers } from "../models/customers";
import jwt, { Secret } from "jsonwebtoken";
import checkAuth from "../middleware/auth";
import { authorization } from "../middleware/authorization";
const store = new customers();
const auth = new authorization();

require("dotenv").config();

const getAllCustomers = async ( res: Response) => {
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
    customer_email: req.body.email,
    cus_first_name: req.body.firstN,
    cus_last_name: req.body.lastN,
    customer_password: req.body.cPass,
    role_id: 1,

  };

  //creat password exception 
  try{
    const checkPassword = customer.customer_password;
if(checkPassword.length<8){
  throw new InvalidPassword("invalid password");
}


}catch(err){
throw new Error("err occured");
}
//end of Ecxaption

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
      res.json(token);
    } else res.json("an Email already exists!");
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

const profile = async (req: Request, res: Response) => {
  try {
    var token = req.cookies.token;
    const getCustomer = jwt.decode(token) as customer;
    const customer = await store.getCustomerWithId(
      getCustomer.customer_id as number
    );
    console.log(getCustomer.customer_id);
    if (customer != null) res.json(customer);
    else res.json("No user found with that ID");
  } catch (error) {
    throw new Error("an error occured " + error);
  }
};

const customer_route = (app: express.Application) => {
  app.get("/customers", checkAuth, auth.adminRole, getAllCustomers);
  app.get("/customer/:id", checkAuth, auth.adminRole, getCustomerWithId);
  app.post("/customer", createCustomer);
  app.post("/auth/customer", authenticate);
  app.get("/profile", checkAuth, profile);
};

export default customer_route;
