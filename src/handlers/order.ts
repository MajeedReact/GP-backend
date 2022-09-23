import express, { Request, Response } from "express";
import { order, orders, order_details } from "../models/orders";
import jwt from "jsonwebtoken";
import { customer } from "../models/customers";
import { product, products } from "../models/product";
import checkAuth from "../middleware/auth";
import moment from "moment";
import { seller } from "../models/Sellers";
import { v4 as uuidv4 } from "uuid";
import { authorization } from "../middleware/authorization";

const store = new orders();
const productModel = new products();
const auth = new authorization();

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
    //get customer_id from token
    const token = req.cookies.token;
    const decode = jwt.decode(token) as customer;

    //generate unique order authentication
    const uniqueID = uuidv4();
    console.log(uniqueID.substring(0, 6));
    //if placing an order is a seller return 401
    if (decode.role_id == 2)
      return res.status(403).json("Seller cannot buy orders");

    const product = req.body.product;

    const productInfo = (await productModel.getProductWithId(
      product[0].id as number
    )) as product;
    //create a new order

    const order: order = {
      order_status: "New",
      customer_id: decode.customer_id as number,
      seller_id: productInfo.seller_id,
      order_auth: uniqueID.substring(0, 6),
    };

    const insertOrder = await store.createOrder(order);

    for (var item = 0; item < product.length; item++) {
      let product_id: number = await product[item].id;
      const productInfo = (await productModel.getProductWithId(
        product_id
      )) as product;

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

      console.log("Product id: " + product_id);
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

    //if seller or admin
    if (decode.customer_id || decode.role_id == 3) {
      const result = await store.getOrderDetails(
        req.params.id as unknown as number
      );
      //check if order has the same requested customer id
      if (
        (result[0].customer_id == decode.customer_id && result.length > 1) ||
        decode.role_id == 3
      ) {
        res.status(200).json(result);
      } else {
        res.status(403).json("Unauthorized");
        return;
      }
    }
    //if seller id/customer id equals to the seller id/customer id in order then show order_details
    if (decodeSeller.seller_id) {
      const result = await store.getOrderDetailSeller(
        req.params.id as unknown as number
      );
      if (result[0].seller_id == decodeSeller.seller_id && result.length > 1) {
        res.status(200).json(result);
      } else {
        res.status(403).json("Unauthorized");
        return;
      }
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

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order_auth = req.body.order_auth;
    const result = await store.updateOrder(
      req.params.id as unknown as number,
      "Complete",
      order_auth
    );

    if (!result) {
      res.status(403).json("order authentication is not correct");
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An error occured updating order with id " + req.params.id + ": " + error
    );
  }
};

const orders_route = (app: express.Application) => {
  app.get("/orders", checkAuth, auth.adminRole, allOrders);
  app.get("/orders/customer", checkAuth, getAllOrdersByCustomer);
  app.get("/orders/seller", checkAuth, getAllOrdersBySeller);
  app.get("/orders/:id", checkAuth, getOrderDetails);
  app.post("/orders/new", checkAuth, createOrder);
  app.put("/orders/:id", updateOrderStatus);
};

export default orders_route;
