"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = __importDefault(require("../model/dashboard"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../../../middleware/auth"));
const authorization_1 = require("../../../middleware/authorization");
const store = new dashboard_1.default();
const auth = new authorization_1.authorization();
const getAllOrdersBySellerEachMonth = async (req, res) => {
    try {
        //get token
        const token = req.cookies.token;
        const decode = jsonwebtoken_1.default.decode(token);
        const result = await store.getAllOrdersBySellerEachMonth(decode.seller_id);
        res.status(200).json(result);
    }
    catch (error) {
        throw new Error("An Error occured while getting orders by seller " + error);
    }
};
const dashboardSeller_route = async (app) => {
    app.get("/sellerOrdersByMonth", auth_1.default, auth.checkSellerOrAdmin, getAllOrdersBySellerEachMonth);
};
exports.default = dashboardSeller_route;
