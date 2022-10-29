"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customers_1 = require("../models/customers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const authorization_1 = require("../middleware/authorization");
const validation_1 = require("../middleware/validation");
const createAccount_1 = require("../validationSchema/createAccount");
const store = new customers_1.customers();
const auth = new authorization_1.authorization();
require("dotenv").config();
const getAllCustomers = async (req, res) => {
    try {
        const allCustomers = await store.getAllCustomers();
        res.json(allCustomers);
    }
    catch (err) {
        throw new Error(`An Error occured retriving customers: ${err}`);
    }
};
const getCustomerWithId = async (req, res) => {
    //casting
    const seller = await store.getCustomerWithId(req.params.id);
    if (seller != null)
        res.json(seller);
    else
        res.json("No user found with that ID");
};
//customer creation
const createCustomer = async (req, res) => {
    const customer = {
        customer_email: req.body.email,
        cus_first_name: req.body.cus_first_name,
        cus_last_name: req.body.cus_last_name,
        customer_password: req.body.password,
        role_id: 1,
    };
    //email check
    try {
        const checkEmail = await store.checkEmail(customer.customer_email);
        if (!checkEmail) {
            const newCustomer = await store.createCustomer(customer);
            customer.customer_id = newCustomer.customer_id;
            var token = jsonwebtoken_1.default.sign(newCustomer, process.env.TOKEN_SECRET, {
                expiresIn: "1d",
            });
            console.log(newCustomer.customer_id);
            res.json("success");
        }
        else
            res.status(400).json("an Email already exists!");
        return;
    }
    catch (err) {
        throw new Error("An error occured while creating the account " + err);
    }
    //email check
    //end of customer creation
};
const authenticate = async (req, res) => {
    try {
        const login = await store.loginCustomer(req.body.email, req.body.password);
        if (login != null) {
            const loginCustomer = {
                cus_first_name: login.cus_first_name,
                customer_email: login.customer_email,
                customer_id: login.customer_id,
                role_id: login.role_id,
            };
            console.log(login.cus_first_name);
            var token = jsonwebtoken_1.default.sign(loginCustomer, process.env.TOKEN_SECRET, {
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
    }
    catch (error) {
        throw new Error("An Error occured while logging in" + error);
    }
};
const logout = async (req, res) => {
    //set cookie age to 0 so it gets cleared immediately
    res.cookie("token", "", { maxAge: 0 });
};
const profile = async (req, res) => {
    try {
        var token = req.cookies.token;
        const getCustomer = jsonwebtoken_1.default.decode(token);
        const customer = await store.getCustomerWithId(getCustomer.customer_id);
        if (customer != null)
            res.json(customer);
        else
            res.json("No user found with that ID");
    }
    catch (error) {
        throw new Error("an error occured " + error);
    }
};
const customer_route = (app) => {
    app.get("/customers", auth_1.default, auth.adminRole, getAllCustomers);
    app.get("/customer/:id", auth_1.default, getCustomerWithId);
    app.post("/customer", createAccount_1.createAccountValidation, validation_1.checkEmailAndPassword, createCustomer);
    app.post("/auth/customer", authenticate);
    app.get("/profile", auth_1.default, profile);
    app.post("/logout", logout);
};
exports.default = customer_route;
