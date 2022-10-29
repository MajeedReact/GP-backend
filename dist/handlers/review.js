"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_1 = require("../models/review");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const authorization_1 = require("../middleware/authorization");
const store = new review_1.reviewClass();
const auth = new authorization_1.authorization();
require("dotenv").config();
const getAllReviewByProductID = async (req, res) => {
    try {
        const result = await store.getAllReviewByProductID(req.params.id);
        console.log(result);
        res.json(result);
    }
    catch (error) {
        throw new Error(`An Error occured while getting reviews ${error}`);
    }
};
const getReviewByID = async (req, res) => {
    try {
        const result = await store.getReviewByID(req.params.id);
        res.json(result);
    }
    catch (error) {
        throw new Error(`An Error occured while getting review ${error}`);
    }
};
const insertReview = async (req, res) => {
    try {
        //cheeck if the user logged in or not
        //check if the user bought the product or not
        //cheeck if the user already posted a review or not
        var token = req.cookies.token;
        var decode = jsonwebtoken_1.default.decode(token);
        console.log(decode.cus_first_name);
        const reviewObject = {
            description: req.body.description,
            rating: req.body.rating,
            product_id: req.body.product_id,
            customer_id: decode.customer_id,
            cus_first_name: decode.cus_first_name,
        };
        //check if the user bought the product or not
        const result = await store.checkReview(reviewObject.product_id, decode.customer_id);
        //check if the user already posted a review or not
        const checkDuplicate = await store.checkDuplicate(decode.customer_id, reviewObject.product_id);
        //if the user bought the product
        if (!result) {
            res.status(403).json("You have not bought the product");
            return;
        }
        //if there is a duplicate then it should return true
        if (checkDuplicate) {
            res.status(403).json("You already posted a review");
            return;
        }
        const postReview = await store.insertReview(reviewObject);
        res.status(200).json(postReview);
    }
    catch (error) {
        throw new Error(`An Error occured while getting reviews ${error}`);
    }
};
const review_route = (app) => {
    app.get("/review/product/:id", getAllReviewByProductID);
    app.get("/review/:id", getReviewByID);
    app.post("/review", auth_1.default, auth.isCustomer, insertReview);
};
exports.default = review_route;
