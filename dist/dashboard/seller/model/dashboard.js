"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../database"));
class dashboardSeller {
    async getAllOrdersBySellerEachMonth(seller_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT DATE_TRUNC('month',order_date) AS  order_date, COUNT(order_id) AS count FROM orders WHERE seller_id = $1 GROUP BY DATE_TRUNC('month',order_date)";
            const result = await conn.query(sql, [seller_id]);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error("An Error occured retriving orders for seller with id " +
                seller_id +
                " " +
                error);
        }
    }
}
exports.default = dashboardSeller;
