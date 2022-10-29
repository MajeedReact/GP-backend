"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../database"));
class dashboardAdmin {
    async getNumberOfCustomerEachMonth() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT DATE_TRUNC('month',created_at) AS  created_at, COUNT(customer_id) AS count FROM customer GROUP BY DATE_TRUNC('month',created_at)";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of customers each month " +
                error);
        }
    }
    async getTotalCustomer() {
        try {
            const conn = await database_1.default.connect();
            const sql = "select COUNT(*) from customer";
            const result = await conn.query(sql);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of customers each month " +
                error);
        }
    }
    async numberOfCustomerLast7Days() {
        try {
            const conn = await database_1.default.connect();
            const sql = "select COUNT(*) from customer where created_at > current_date - interval '7 days'";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of customers for the last 7 days " +
                error);
        }
    }
    async getNumberOfSellerEachMonth() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT DATE_TRUNC('month',created_at) AS  created_at, COUNT(seller_id) AS count FROM seller GROUP BY DATE_TRUNC('month',created_at)";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of sellers each month " + error);
        }
    }
    async numberOfSellerLast7Days() {
        try {
            const conn = await database_1.default.connect();
            const sql = "select COUNT(*) from seller where created_at > current_date - interval '7 days'";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of sellers for the last 7 days " +
                error);
        }
    }
    //number of order each mounth
    async getNumberOfOrdersEachMonth() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT DATE_TRUNC('month',order_date) AS  order_date, COUNT(order_id) AS count FROM orders GROUP BY DATE_TRUNC('month',order_date)";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of orders each month " + error);
        }
    }
    //number of order last week
    async numberOfOrdersLast7Days() {
        try {
            const conn = await database_1.default.connect();
            const sql = "select COUNT(*) from orders where order_date > current_date - interval '7 days'";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of orders for the last 7 days " +
                error);
        }
    }
    //get number of products for each month
    async getNumberOfProductsEachMonth() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT DATE_TRUNC('month',created_at) AS  created_at, COUNT(product_id) AS count FROM product GROUP BY DATE_TRUNC('month',created_at)";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of products each month " +
                error);
        }
    }
    //get number of product for last week (7 days)
    async numberOfProductsLast7Days() {
        try {
            const conn = await database_1.default.connect();
            const sql = "select COUNT(*) from product where created_at > current_date - interval '7 days'";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving number of products for the last 7 days " +
                error);
        }
    }
    //get most ordered products
    async mostOrderedProduct() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT product_id, COUNT(product_id) from orders_details GROUP BY product_id HAVING COUNT(product_id) > 1 ORDER BY COUNT DESC LIMIT 5;";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured while retriving most ordered products " + error);
        }
    }
}
exports.default = dashboardAdmin;
