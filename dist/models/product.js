"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = void 0;
const database_1 = __importDefault(require("../database"));
class products {
    async getAllProductsFromSeller(sellerID) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM product WHERE seller_id = $1";
            const result = await conn.query(sql, [sellerID]);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive product: ${err}`);
        }
    }
    //get all product
    async getAllProducts() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM product";
            const result = await conn.query(sql);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive product: ${err}`);
        }
    }
    //get latest 3 products
    async latestProducts() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM product order by created_at DESC LIMIT 3";
            const result = await conn.query(sql);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive product: ${err}`);
        }
    }
    //get specific product
    async getProductWithId(product_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM product WHERE product_id = $1";
            const result = await conn.query(sql, [product_id]);
            //close the connection
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not retrive product_id: ${err}`);
        }
    }
    //create product
    async createProduct(p) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO product (product_name, product_quantity, product_description, price, tags, lat, lan, city, neighborhood, seller_id, category_id) VALUES ($1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";
            const result = await conn.query(sql, [
                p.product_name,
                p.product_quantity,
                p.product_description,
                p.price,
                p.tags,
                p.lat,
                p.lan,
                p.city,
                p.neighborhood,
                p.seller_id,
                p.category_id,
            ]);
            //close the connection
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create product: ${err}`);
        }
    }
    //upate quantity
    async updateQty(id, quantity) {
        try {
            const conn = await database_1.default.connect();
            const sql = "UPDATE product SET product_quantity = $1 WHERE product_id = $2";
            const result = await conn.query(sql, [quantity, id]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`An error occured while updating quantity of the product` + error);
        }
    }
    //Insert Images as binary or base64
    async insertImage(img) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO product_images (image_name, image_byte, product_id) VALUES ($1, $2, $3)";
            const result = await conn.query(sql, [
                img.image_name,
                img.image_byte,
                img.product_id,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`An error occured while updating quantity of the product` + error);
        }
    }
}
exports.products = products;
