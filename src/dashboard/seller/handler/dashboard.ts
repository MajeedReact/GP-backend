import express, { Request, Response } from "express";
import dashboardSeller from "../model/dashboard";
import jwt from "jsonwebtoken";
import { seller } from "../../../models/Sellers";
import checkAuth from "../../../middleware/auth";
import { authorization } from "../../../middleware/authorization";
const store = new dashboardSeller();
const auth = new authorization();
const getAllOrdersBySellerEachMonth = async (req: Request, res: Response) => {
  try {
    //get token
    const token = req.cookies.token;

    const decode = jwt.decode(token) as seller;

    const result = await store.getAllOrdersBySellerEachMonth(
      decode.seller_id as unknown as number
    );

    res.status(200).json(result);
  } catch (error) {
    throw new Error("An Error occured while getting orders by seller " + error);
  }
};

const dashboardSeller_route = async (app: express.Application) => {
  app.get(
    "/sellerOrdersByMonth",
    checkAuth,
    auth.checkSellerOrAdmin,
    getAllOrdersBySellerEachMonth
  );
};

export default dashboardSeller_route;
