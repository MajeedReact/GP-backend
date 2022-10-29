"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = void 0;
const database_1 = __importDefault(require("../database"));
class categories {
    //public
    async getAllCategories() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM category";
            const result = await conn.query(sql);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive categories: ${err}`);
        }
    }
    async getCategoryByID(category_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM category WHERE category_id = $1";
            const result = await conn.query(sql, [category_id]);
            //close the connection
            conn.release();
            if (result.rows.length) {
                return result.rows[0];
            }
            else {
                return null;
            }
        }
        catch (err) {
            throw new Error(`Could not retrive category: ${err}`);
        }
    }
    //get specific category and all their posts maybe use join
    async getProductByCategory(category_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM product WHERE category_id = $1";
            const result = await conn.query(sql, [category_id]);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive seller: ${err}`);
        }
    }
    //admin use in dashboard
    async createCategory(s) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO category (category_name) VALUES ($1) RETURNING category_name";
            const result = await conn.query(sql, [s.Category_Name]);
            //close the connection
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create category: ${err}`);
        }
    }
    //upate seller
    //delete category, admin use only!
    async deleteCategory(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "DELETE FROM category WHERE category_id = $1";
            const result = await conn.query(sql, [id]);
            //close the connection
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not delete category with id ${id}: ${err}`);
        }
    }
}
exports.categories = categories;
