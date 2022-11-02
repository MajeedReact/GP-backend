import express, { Request, Response } from "express";
import { order, orders, order_details } from "../models/orders";
import jwt from "jsonwebtoken";
import { customer } from "../models/customers";
import { product, products } from "../models/product";
import checkAuth from "../middleware/auth";
import { seller } from "../models/Sellers";
import { v4 as uuidv4 } from "uuid";
import { authorization } from "../middleware/authorization";
import { sellers } from "../models/Sellers";
import email from "../nodemailer/nodemailer";

const sellerOrder = new sellers();

const store = new orders();
const productModel = new products();
const auth = new authorization();
const emailService = new email();

//admin use
const allOrders = async (_req: Request, res: Response) => {
  try {
    const allOrders = await store.getAllOrders();
    res.json(allOrders);
  } catch (err) {
    throw new Error(`An Error occured retriving orders: ${err}`);
  }
};
const getOrderID = async (req: Request, res: Response) => {
  try {
    const allOrders = await store.getOrderID(
      req.params.id as unknown as number
    );
    res.json(allOrders);
  } catch (err) {
    throw new Error(`An Error occured retriving orders: ${err}`);
  }
};

const createOrder = async (req: Request, res: Response) => {
  //get customer_id from token
  const token = req.cookies.token;
  const decode = jwt.decode(token) as customer;

  console.log(req.body[0]);

  //generate unique order authentication
  const uniqueID = uuidv4();
  console.log(uniqueID.substring(0, 6));
  //if placing an order is a seller return 401
  if (decode.role_id == 2)
    return res.status(403).json("Seller cannot buy orders");

  const product = req.body;

  const productInfo = (await productModel.getProductWithId(
    product[0].product_id as number
  )) as product;

  if (productInfo == undefined || productInfo == null) {
    res.status(404).json("No Seller id found");
    return;
  }
  const sellerID = productInfo.seller_id;
  //check products in cart validation
  for (var item = 0; item < product.length; item++) {
    let product_id: number = await product[item].product_id;
    const productInfo = (await productModel.getProductWithId(
      product_id
    )) as product;

    if (productInfo == undefined || productInfo == null) {
      res.status(404).json("No Seller id found");
      return;
    }

    if (productInfo.seller_id != sellerID) {
      return res
        .status(400)
        .json(
          "You have two different sellers within one order\n Kindly remove the products from the other seller to proceed"
        );
    }

    //check product quantity
    let qty: number = await product[item].qty;
    if (productInfo.product_quantity < qty) {
      res.status(400).json("Invalid quantity");
      return;
    }
  }
  //create a new order
  const order: order = {
    order_status: "New",
    customer_id: decode.customer_id as number,
    seller_id: productInfo.seller_id,
    order_auth: uniqueID.substring(0, 6),
  };

  const insertOrder = await store.createOrder(order);

  for (var item = 0; item < product.length; item++) {
    let product_id: number = await product[item].product_id;
    const productInfo = (await productModel.getProductWithId(
      product_id
    )) as product;
    let qty: number = await product[item].qty;
    // if (productInfo == undefined || productInfo == null) {
    //   res.status(404).json("No Seller id found");
    //   return;
    // }

    // //check product quantity
    // let qty: number = await product[item].qty;
    // if (productInfo.product_quantity < qty) {
    //   res.json("Invalid quantity");
    //   return;
    // }

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
      customer_id: decode.customer_id,
    };

    let insertDetails = await store.insertOrderDetails(order_details);
  }

  try {
    //get seller information so we can use it to send an email to it
    const getSellerInfo = await sellerOrder.getSellerWithId(
      productInfo.seller_id
    );
    const sellerEmail = getSellerInfo.seller_email;
    console.log(sellerEmail);
    console.log(decode.customer_email);

    try {
      //send email to customer
      emailService.emailTo(
        decode.customer_email,
        "New Order",
        `Thank you for shopping with us, a new order was created your order ID is ${insertOrder.order_id}`
      );
      //send email
      emailService.emailTo(
        sellerEmail,
        "New Order",
        `A customer have purchased products from you, a new order was created your order ID is ${insertOrder.order_id}`
      );
    } catch (error) {
      throw new Error("An Error occured while sending " + error);
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

    //if seller or admin
    if (decode.role_id == 1 || decode.role_id == 3) {
      const result = await store.getOrderDetails(
        req.params.id as unknown as number
      );
      //check if order has the same requested customer id
      if (result.length < 1) {
        return res.status(404).json("Not found");
      }
      res.status(200).json(result);
      return;
    }
  } catch (error) {
    throw new Error("an Error occured while getting order details " + error);
  }
};
const getOrderDetailsSeller = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    const decode = jwt.decode(token) as seller;

    //if seller or admin
    if (decode.role_id == 2 || decode.role_id == 3) {
      const result = await store.getOrderDetailSeller(
        req.params.id as unknown as number
      );
      console.log(result);
      if (result.length >= 1) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json("Not found");
      }
    } else {
      res.status(400).json("Not a seller or an admin");
    }
  } catch (error) {
    throw new Error("an Error occured while getting order details " + error);
  }
};

const getAllOrdersByCustomer = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.decode(token) as customer;
    if (decode.role_id == 1 || decode.role_id == 3) {
      const result = await store.getAllOrdersByCustomer(
        decode.customer_id as number
      );

      res.status(200).json(result);
    } else {
      return res.status(401).json("Unauthorized");
    }
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
    if (decode.role_id == 2 || decode.role_id == 3) {
      const result = await store.getAllOrdersBySeller(
        decode.seller_id as number
      );
      res.status(200).json(result);
      return;
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
    console.log(order_auth);

    const result = await store.updateOrder(
      req.params.id as unknown as number,
      "Complete",
      order_auth
    );

    if (!result) {
      res.status(403).json("Order authentication is not correct");
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An error occured updating order with id " + req.params.id + ": " + error
    );
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    await store.deleteOrderDetails(req.params.id as unknown as number);
    const result = await store.deleteOrder(req.params.id as unknown as number);

    res.status(200).json("success");
  } catch (error) {
    throw new Error(
      "An error occured delete order with id " + req.params.id + ": " + error
    );
  }
};

const orders_route = (app: express.Application) => {
  app.get("/orders", checkAuth, auth.adminRole, allOrders);
  app.get("/orders/customer", checkAuth, getAllOrdersByCustomer);
  app.get("/orders/seller", checkAuth, getAllOrdersBySeller);
  app.get("/orders/:id", checkAuth, getOrderDetails);
  app.get("/seller/orders/:id", checkAuth, getOrderDetailsSeller);
  app.get("/order/:id", checkAuth, getOrderID);
  app.post("/orders/new", checkAuth, createOrder);
  app.put("/orders/:id", updateOrderStatus);
  app.delete("/orders/:id", checkAuth, auth.adminRole, deleteOrder);
};

export default orders_route;
