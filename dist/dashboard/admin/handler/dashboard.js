"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = __importDefault(require("../model/dashboard"));
const authorization_1 = require("../../../middleware/authorization");
const auth_1 = __importDefault(require("../../../middleware/auth"));
const store = new dashboard_1.default();
const auth = new authorization_1.authorization();
const getNumberOfCustomersEachMonth = async (req_, res) => {
    try {
        const result = await store.getNumberOfCustomerEachMonth();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of customer each month" + error);
    }
};
const getTotalCustomer = async (req_, res) => {
    try {
        const result = await store.getTotalCustomer();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of customer each month" + error);
    }
};
const numberOfCustomerLast7Days = async (req_, res) => {
    try {
        const result = await store.numberOfCustomerLast7Days();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of customers for the last 7 days " +
            error);
    }
};
const getNumberOfSellersEachMonth = async (req_, res) => {
    try {
        const result = await store.getNumberOfSellerEachMonth();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of Seller each month" + error);
    }
};
const numberOfSellersLast7Days = async (req_, res) => {
    try {
        const result = await store.numberOfSellerLast7Days();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of Seller for the last 7 days " +
            error);
    }
};
const getNumberOfOrdersEachMonth = async (req_, res) => {
    try {
        const result = await store.getNumberOfOrdersEachMonth();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of Orders each month" + error);
    }
};
const numberOfOrdersLast7Days = async (req_, res) => {
    try {
        const result = await store.numberOfOrdersLast7Days();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of Orders for the last 7 days " +
            error);
    }
};
const getNumberOfProductsEachMonth = async (req_, res) => {
    try {
        const result = await store.getNumberOfProductsEachMonth();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of products each month" + error);
    }
};
const numberOfProductsLast7Days = async (req_, res) => {
    try {
        const result = await store.numberOfProductsLast7Days();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving number of products for the last 7 days " +
            error);
    }
};
const mostOrderedProduct = async (req_, res) => {
    try {
        const result = await store.mostOrderedProduct();
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while retriving most ordered products " + error);
    }
};
const dashboardAdmin_route = (app) => {
    app.get("/customerEachMonth", getNumberOfCustomersEachMonth);
    app.get("/totalCustomer", getTotalCustomer);
    app.get("/customerLast7Days", 
    // checkAuth,
    // auth.adminRole,
    numberOfCustomerLast7Days);
    app.get("/sellerEachMonth", 
    // checkAuth,
    // auth.adminRole,
    getNumberOfSellersEachMonth);
    app.get("/sellerLast7Days", auth_1.default, auth.adminRole, numberOfSellersLast7Days);
    app.get("/OrdersEachMonth", 
    // checkAuth,
    // auth.adminRole,
    getNumberOfOrdersEachMonth);
    app.get("/OrdersLast7Days", auth_1.default, auth.adminRole, numberOfOrdersLast7Days);
    app.get("/ProductsLastMonth", auth_1.default, auth.adminRole, getNumberOfProductsEachMonth);
    app.get("/ProductsLast7Days", auth_1.default, auth.adminRole, numberOfProductsLast7Days);
    app.get("/MostOrderedProduct", auth_1.default, auth.adminRole, mostOrderedProduct);
};
exports.default = dashboardAdmin_route;
