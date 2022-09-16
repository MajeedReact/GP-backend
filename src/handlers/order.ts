import express, { Request, Response } from "express";
import { order, orders, order_details } from "../models/orders";
import jwt from "jsonwebtoken";
import { customer } from "../models/customers";
import { product, products } from "../models/product";
import checkAuth from "../middleware/auth";
import moment from "moment";
import { seller } from "../models/Sellers";
import { v4 as uuidv4 } from "uuid";

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

    //if placing a purchase is a seller return 401
    if (decode.role_id == 2)
      return res.status(403).json("Seller cannot buy orders");

    const product = req.body.product;

    const productInfo = (await productModel.getProductWithId(
      product[0].id as number
    )) as product;
    // console.log(decode.customer_id);
    //create a new order

    const order: order = {
      order_status: "New",
      customer_id: decode.customer_id as number,
      order_date: date,
      seller_id: productInfo.seller_id,
    };

    const insertOrder = await store.createOrder(order);

    for (var item in product) {
      // console.log(
      //   `product id: ${product2[item].id} product quantity: ${product2[item].qty} seller id: ${product2[item].seller_id}`
      // );

      let product_id: number = await product[item].id;
      const productInfo = (await productModel.getProductWithId(
        product_id
      )) as product;
      // const seller_id = productInfo.seller_id as number;

      if (productInfo.seller_id == undefined || productInfo.seller_id == null) {
        res.status(404).json("No Seller id found");
        return;
      }

      //check product quantity
      let qty: number = await product[item].qty;
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
        product_id: product_id,
        qty: qty,
      };

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
    const decodeSeller = jwt.decode(token) as seller;

    const result = await store.getOrderDetails(
      req.params.id as unknown as number
    );

    //if seller id/customer id equals to the seller id/customer id in order then show order_details
    if (
      result[0].customer_id == decode.customer_id ||
      decode.role_id == 3 ||
      result[0].seller_id == decodeSeller.seller_id
    ) {
      res.status(200).json(result);
    } else {
      res.status(403).json("Unauthorized");
      return;
    }
  } catch (error) {
    throw new Error("an Error occured while getting order details " + error);
  }
};

const getAllOrdersByCustomer = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.decode(token) as customer;

    const result = await store.getAllOrdersByCustomer(
      decode.customer_id as number
    );

    res.status(200).json(result);
  } catch (error) {
    throw new Error("An Error occured while retriving orders " + error);
  }
};

const getAllOrdersBySeller = async (req: Request, res: Response) => {
  try {
    const uniqueID = uuidv4();
    console.log("order_auth: " + uniqueID);

    const token = req.cookies.token;
    const decode = jwt.decode(token) as seller;
    console.log(decode.role_id);
    //if role is seller
    if (decode.role_id == 2) {
      const result = await store.getAllOrdersBySeller(
        decode.seller_id as number
      );
      res.status(200).json(result);
    } else {
      res.status(403).json("Forbidden");
      return;
    }
  } catch (error) {
    throw new Error("An Error occured while retriving orders " + error);
  }
};

const orders_route = (app: express.Application) => {
  app.get("/orders", checkAuth, allOrders);
  app.get("/orders/customer", checkAuth, getAllOrdersByCustomer);
  app.get("/orders/seller", checkAuth, getAllOrdersBySeller);
  app.get("/orders/:id", checkAuth, getOrderDetails);
  app.post("/orders/new", checkAuth, createOrder);
};

export default orders_route;
