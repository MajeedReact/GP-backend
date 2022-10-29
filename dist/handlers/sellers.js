"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validation_1 = require("../middleware/validation");
const Sellers_1 = require("../models/Sellers");
const createAccount_1 = require("../validationSchema/createAccount");
const store = new Sellers_1.sellers();
const getAllSellers = async (_req, res) => {
    try {
        const allSellers = await store.getAllSeller();
        res.json(allSellers);
    }
    catch (err) {
        throw new Error(`An Error occured retriving roles: ${err}`);
    }
};
const getSellerWithId = async (req, res) => {
    //casting
    const seller = await store.getSellerWithId(req.params.id);
    res.json(seller);
};
const createSeller = async (req, res) => {
    const sellers = {
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
            var token = jsonwebtoken_1.default.sign(sellers, process.env.TOKEN_SECRET, {
                expiresIn: "1d",
            });
            console.log(sellers.role_id);
            res.json("token");
        }
        else
            res.status(400).json("an Email already exists!");
        return;
    }
    catch (err) {
        throw new Error("An error occured while creating the account " + err);
    }
};
const authenticate = async (req, res) => {
    try {
        const login = await store.loginSeller(req.body.email, req.body.password);
        if (login != null) {
            const loginSeller = {
                shop_name: login.shop_name,
                seller_email: login.seller_email,
                seller_id: login.seller_id,
                role_id: login.role_id,
            };
            var token = jsonwebtoken_1.default.sign(loginSeller, process.env.TOKEN_SECRET, {
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
    }
    catch (error) {
        throw new Error("An Error occured while logging in" + error);
    }
};
const seller_route = (app) => {
    app.get("/sellers", getAllSellers);
    app.get("/sellers/:id", getSellerWithId);
    app.post("/sellers", createAccount_1.createAccountValidation, validation_1.checkEmailAndPassword, createSeller);
    app.post("/auth/seller", authenticate);
};
exports.default = seller_route;
