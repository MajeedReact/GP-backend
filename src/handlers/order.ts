import express, { Request, Response } from "express";
import { order, orders, order_details } from "../models/orders";
import jwt from "jsonwebtoken";
import { customer } from "../models/customers";
import { product, products } from "../models/product";
import checkAuth from "../middleware/auth";
import moment from "moment";

const store = new orders();
const productModel = new products();

//admin use
const allOrders = async (_req: Request, res: Response) => {
  try {
    const allOrders = await store.getAllOrders();
    res.json(allOrders);
  } catch (err) {
    throw new Error(`An Error occured retriving orders: ${err}`);
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    //get date and time
    const date = moment().format("MMMM Do YYYY, h:mm:ss a");

    //get customer_id from token
    const token = req.cookies.token;
    const decode = jwt.decode(token) as customer;

    const product2 = req.body.product;

    // console.log(decode.customer_id);
    //create a new order
    const order: order = {
      order_status: "New",
      customer_id: decode.customer_id as number,
      order_date: date,
    };

    const insertOrder = await store.createOrder(order);

    for (var item in product2) {
      // console.log(
      //   `product id: ${product2[item].id} product quantity: ${product2[item].qty} seller id: ${product2[item].seller_id}`
      // );

      let product_id: number = await product2[item].id;
      const productInfo = (await productModel.getProductWithId(
        product_id
      )) as product;
      const seller_id = productInfo.seller_id as number;
      console.log(productInfo.price);
      if (productInfo.seller_id == undefined || productInfo.seller_id == null) {
        res.status(404).json("No Seller id found");
        return;
      }

      //check product quantity
      let qty: number = await product2[item].qty;
      if (productInfo.product_quantity < qty) {
        res.json("Invalid quantity");
        return;
      }
      //minus the product quantity from ordered quantity
      const updatedQty = (productInfo.product_quantity as number) - qty;

      //update quantity of product
      const updated = await productModel.updateQty(
        productInfo.product_id as number,
        updatedQty
      );

      let order_details: order_details = {
        order_id: insertOrder.order_id as number,
        seller_id: seller_id,
        product_id: product_id,
        qty: qty,
      };

      console.log(order_details);

      let insertDetails = await store.insertOrderDetails(order_details);

      console.log(`Successfully inserted ${insertDetails}`);
    }

    res.json(insertOrder);
  } catch (error) {
    throw new Error("An Error occured while creating an order " + error);
  }
};

//get customer id to make sure whoever accessing order is the same customer
//get customer id from order and compare it with customer id in the token
const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.decode(token) as customer;
    const check = await store.orderCheck(
      decode.customer_id as number,
      req.params.id as unknown as number
    );

    if (check || decode.role_id == 3) {
      // TODO make sure seller are able to check order
      const result = await store.getOrderDetails(
        req.params.id as unknown as number
      );
      res.json(result);
    } else {
      res.status(403).json("Unauthorized");
      return;
    }
  } catch (error) {
    throw new Error("an Error occured while getting order details " + error);
  }
};

const orders_route = (app: express.Application) => {
  app.get("/orders", checkAuth, allOrders);
  app.get("/orders/:id", checkAuth, getOrderDetails);
  app.post("/orders/new", checkAuth, createOrder);
};

export default orders_route;
