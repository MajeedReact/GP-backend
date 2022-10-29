"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../models/orders");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const product_1 = require("../models/product");
const auth_1 = __importDefault(require("../middleware/auth"));
const uuid_1 = require("uuid");
const authorization_1 = require("../middleware/authorization");
const Sellers_1 = require("../models/Sellers");
const nodemailer_1 = __importDefault(require("../nodemailer/nodemailer"));
const sellerOrder = new Sellers_1.sellers();
const store = new orders_1.orders();
const productModel = new product_1.products();
const auth = new authorization_1.authorization();
const emailService = new nodemailer_1.default();
//admin use
const allOrders = async (_req, res) => {
    try {
        const allOrders = await store.getAllOrders();
        res.json(allOrders);
    }
    catch (err) {
        throw new Error(`An Error occured retriving orders: ${err}`);
    }
};
const createOrder = async (req, res) => {
    try {
        //get customer_id from token
        const token = req.cookies.token;
        const decode = jsonwebtoken_1.default.decode(token);
        //generate unique order authentication
        const uniqueID = uuid_1.v4();
        console.log(uniqueID.substring(0, 6));
        //if placing an order is a seller return 401
        if (decode.role_id == 2)
            return res.status(403).json("Seller cannot buy orders");
        const product = req.body.product;
        const productInfo = (await productModel.getProductWithId(product[0].id));
        if (productInfo == undefined || productInfo == null) {
            res.status(404).json("No Seller id found");
            return;
        }
        //create a new order
        const order = {
            order_status: "New",
            customer_id: decode.customer_id,
            seller_id: productInfo.seller_id,
            order_auth: uniqueID.substring(0, 6),
        };
        const insertOrder = await store.createOrder(order);
        for (var item = 0; item < product.length; item++) {
            let product_id = await product[item].id;
            const productInfo = (await productModel.getProductWithId(product_id));
            if (productInfo == undefined || productInfo == null) {
                res.status(404).json("No Seller id found");
                return;
            }
            //check product quantity
            let qty = await product[item].qty;
            if (productInfo.product_quantity < qty) {
                res.json("Invalid quantity");
                return;
            }
            //minus the product quantity from ordered quantity
            const updatedQty = productInfo.product_quantity - qty;
            //update quantity of product
            const updated = await productModel.updateQty(productInfo.product_id, updatedQty);
            console.log("Product id: " + product_id);
            let order_details = {
                order_id: insertOrder.order_id,
                product_id: product_id,
                qty: qty,
                customer_id: decode.customer_id,
            };
            let insertDetails = await store.insertOrderDetails(order_details);
            console.log(`Successfully inserted ${insertDetails}`);
        }
        //get seller information so we can use it to send an email to it
        const getSellerInfo = await sellerOrder.getSellerWithId(productInfo.seller_id);
        const sellerEmail = getSellerInfo.seller_email;
        console.log(sellerEmail);
        console.log(decode.customer_email);
        try {
            //send email to customer
            emailService.emailTo(decode.customer_email, "New Order", `Thank you for shopping with us, a new order was created your order ID is ${insertOrder.order_id}`);
            //send email
            emailService.emailTo(sellerEmail, "New Order", `A customer have purchased products from you, a new order was created your order ID is ${insertOrder.order_id}`);
        }
        catch (error) {
            throw new Error("An Error occured while sending " + error);
        }
        res.json(insertOrder);
    }
    catch (error) {
        throw new Error("An Error occured while creating an order " + error);
    }
};
//get customer id to make sure whoever accessing order is the same customer
//get customer id from order and compare it with customer id in the token
const getOrderDetails = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decode = jsonwebtoken_1.default.decode(token);
        const decodeSeller = jsonwebtoken_1.default.decode(token);
        //if seller or admin
        if (decode.customer_id || decode.role_id == 3) {
            const result = await store.getOrderDetails(req.params.id);
            //check if order has the same requested customer id
            if ((result[0].customer_id == decode.customer_id && result.length > 1) ||
                decode.role_id == 3) {
                res.status(200).json(result);
            }
            else {
                res.status(403).json("Unauthorized");
                return;
            }
        }
        //if seller id/customer id equals to the seller id/customer id in order then show order_details
        if (decodeSeller.seller_id) {
            const result = await store.getOrderDetailSeller(req.params.id);
            if (result[0].seller_id == decodeSeller.seller_id && result.length > 1) {
                res.status(200).json(result);
            }
            else {
                res.status(403).json("Unauthorized");
                return;
            }
        }
    }
    catch (error) {
        throw new Error("an Error occured while getting order details " + error);
    }
};
const getAllOrdersByCustomer = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decode = jsonwebtoken_1.default.decode(token);
        const result = await store.getAllOrdersByCustomer(decode.customer_id);
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving orders " + error);
    }
};
const getAllOrdersBySeller = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decode = jsonwebtoken_1.default.decode(token);
        console.log(decode.role_id);
        //if role is seller
        if (decode.role_id == 2) {
            const result = await store.getAllOrdersBySeller(decode.seller_id);
            res.status(200).json(result);
        }
        else {
            res.status(403).json("Forbidden");
            return;
        }
    }
    catch (error) {
        throw new Error("An Error occured while retriving orders " + error);
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const order_auth = req.body.order_auth;
        const result = await store.updateOrder(req.params.id, "Complete", order_auth);
        if (!result) {
            res.status(403).json("order authentication is not correct");
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An error occured updating order with id " + req.params.id + ": " + error);
    }
};
const orders_route = (app) => {
    app.get("/orders", allOrders); // checkAuth, auth.adminRole,
    app.get("/orders/customer", auth_1.default, getAllOrdersByCustomer);
    app.get("/orders/seller", auth_1.default, getAllOrdersBySeller);
    app.get("/orders/:id", auth_1.default, getOrderDetails);
    app.post("/orders/new", auth_1.default, createOrder);
    app.put("/orders/:id", updateOrderStatus);
};
exports.default = orders_route;
