import express, { Response, Request } from "express";
import { review, reviewClass } from "../models/review";
import moment from "moment";
import jwt, { Secret } from "jsonwebtoken";
import { customer } from "../models/customers";
import checkAuth from "../middleware/auth";
import { authorization } from "../middleware/authorization";

const store = new reviewClass();
const auth = new authorization();

require("dotenv").config();

const getAllReviewByProductID = async (req: Request, res: Response) => {
  try {
    const result = await store.getAllReviewByProductID(
      req.params.id as unknown as number
    );
    console.log(result);
    res.json(result);
  } catch (error) {
    throw new Error(`An Error occured while getting reviews ${error}`);
  }
};

const getReviewByID = async (req: Request, res: Response) => {
  try {
    const result = await store.getReviewByID(
      req.params.id as unknown as number
    );
    res.json(result);
  } catch (error) {
    throw new Error(`An Error occured while getting review ${error}`);
  }
};

const insertReview = async (req: Request, res: Response) => {
  try {
    //cheeck if the user logged in or not
    //check if the user bought the product or not
    //cheeck if the user already posted a review or not
    var token = req.cookies.token;
    var decode = jwt.decode(token) as customer;

    const reviewObject: review = {
      description: req.body.description,
      rating: req.body.rating,
      product_id: req.body.product_id,
      customer_id: decode.customer_id as unknown as number,
    };

    //check if the user bought the product or not
    const result = await store.checkReview(
      decode.customer_id as unknown as number,
      reviewObject.product_id
    );
    //check if the user already posted a review or not
    const checkDuplicate = await store.checkDuplicate(
      decode.customer_id as unknown as number,
      reviewObject.product_id
    );

    //if the user bought the product and have not posted a review then true
    if (result) {
      if (checkDuplicate) {
        const postReview = store.insertReview(reviewObject);
        res.status(200).json(postReview);

        return;
      } else {
        res.json("You already posted a review");
        return;
      }
    } else {
      res
        .status(401)
        .json(
          "You cannot submit reviews because you have not bought this product!"
        );
      return;
    }
  } catch (error) {
    throw new Error(`An Error occured while getting reviews ${error}`);
  }
};
``;

const review_route = (app: express.Application) => {
  app.get("/review/product/:id", getAllReviewByProductID);
  app.get("/review/:id", getReviewByID);
  app.post("/review", checkAuth, auth.isCustomer, insertReview);
};

export default review_route;
