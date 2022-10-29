"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellers = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
class sellers {
    async checkShopName(shop_name) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT shop_name FROM seller WHERE shop_name = $1";
            const result = await conn.query(sql, [shop_name]);
            //close the connection
            conn.release();
            if (result.rows.length)
                return true;
            return false;
        }
        catch (err) {
            throw new Error(`Could not retrive roles: ${err}`);
        }
    }
    //for admins only
    async getAllSeller() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM seller";
            const result = await conn.query(sql);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive roles: ${err}`);
        }
    }
    //get specific seller and all their posts maybe use join
    async getSellerWithId(seller_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM seller WHERE seller_id = $1";
            const result = await conn.query(sql, [seller_id]);
            //close the connection
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not retrive seller: ${err}`);
        }
    }
    //getSellerPageWithShopName
    //create seller, add phone number
    async createSeller(s) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO seller (seller_email, seller_password, shop_name, role_id) VALUES ($1, $2, $3, $4) RETURNING shop_name";
            const hash = bcrypt_1.default.hashSync(s.seller_password + pepper, Number(saltRounds));
            const result = await conn.query(sql, [
                s.seller_email,
                hash,
                s.shop_name,
                s.role_id, //which is seller role may change it later
            ]);
            //close the connection
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create seller: ${err}`);
        }
    }
    async checkEmail(email) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT seller_email FROM seller WHERE seller_email = $1";
            const result = await conn.query(sql, [email]);
            //close connection
            conn.release;
            if (result.rows.length) {
                return true;
            }
            else
                false;
        }
        catch (error) {
            throw new Error("an error occured while checking for email " + error);
        }
    }
    async loginSeller(email, password) {
        try {
            //connect to database
            const conn = await database_1.default.connect();
            //get the customer details from database
            const sql = "SELECT * FROM seller WHERE seller_email = $1";
            const result = await conn.query(sql, [email]);
            conn.release();
            //check if there is a result with credintials
            if (result.rows.length) {
                const seller = result.rows[0];
                //hash the current password and compare it with the customer password in the database
                if (bcrypt_1.default.compareSync(password + pepper, seller.seller_password)) {
                    return seller;
                }
            }
            return null;
        }
        catch (error) {
            throw new Error("An Error occured while retriving login details " + error);
        }
    }
}
exports.sellers = sellers;
