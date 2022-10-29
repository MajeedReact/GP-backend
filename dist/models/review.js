"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewClass = void 0;
const database_1 = __importDefault(require("../database"));
class reviewClass {
    async getAllReviewByProductID(product_id) {
        try {
            const conn = await database_1.default.connect();
            //get all reviews from specfic product id by using inner join
            const sql = "SELECT * FROM review WHERE product_id = $1";
            const result = await conn.query(sql, [product_id]);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not retrive reviews from the server ${error}`);
        }
    }
    async getReviewByID(review_id) {
        try {
            const conn = await database_1.default.connect();
            //get all reviews from specfic product id by using inner join
            const sql = "SELECT * FROM review WHERE review_id = $1";
            const result = await conn.query(sql, [review_id]);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not retrive reviews from the server ${error}`);
        }
    }
    async insertReview(r) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO review (description, rating, product_id, customer_id, cus_first_name) VALUES($1, $2, $3, $4, $5) RETURNING *";
            const result = await conn.query(sql, [
                r.description,
                r.rating,
                r.product_id,
                r.customer_id,
                r.cus_first_name,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error("An error occured while inserting review" + error);
        }
    }
    async checkReview(product_id, customer_id) {
        try {
            const conn = await database_1.default.connect();
            //check if the user bought
            const sql = "SELECT * from orders_details WHERE product_id = $1 AND customer_id = $2;";
            const result = await conn.query(sql, [product_id, customer_id]);
            conn.release();
            if (result.rows.length > 0) {
                return true;
            }
            else
                return false;
        }
        catch (error) { }
    }
    async checkDuplicate(customer_id, product_id) {
        try {
            const conn = await database_1.default.connect();
            //check if the user already posted a review
            const sql = "SELECT * FROM review WHERE customer_id = $1 AND product_id = $2";
            const result = await conn.query(sql, [customer_id, product_id]);
            console.log(result.rows.length);
            conn.release();
            if (result.rows.length > 0) {
                return true;
            }
            else
                return false;
        }
        catch (error) { }
    }
}
exports.reviewClass = reviewClass;
