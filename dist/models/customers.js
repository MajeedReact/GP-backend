"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customers = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
class customers {
    async getAllCustomers() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM customer";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not retrive customers ${error}`);
        }
    }
    async getCustomerWithId(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM customer WHERE customer_id = $1";
            const result = await conn.query(sql, [id]);
            conn.release;
            //checking if there is a result
            if (result.rows.length) {
                //save result into variable customer
                const customer = result.rows[0];
                //check if it is not null
                if (customer != null)
                    return customer;
            }
            //else not found return null
            return null;
        }
        catch (error) {
            throw new Error(`Could not retrive customer with id ${id} ${error}`);
        }
    }
    async createCustomer(c) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO customer(customer_email, Cus_First_Name,  Cus_Last_Name, Customer_Password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
            const hash = bcrypt_1.default.hashSync(c.customer_password + pepper, Number(saltRounds));
            const result = await conn.query(sql, [
                c.customer_email,
                c.cus_first_name,
                c.cus_last_name,
                hash,
                c.role_id,
            ]);
            //close connection
            conn.release;
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not create customer ${error}`);
        }
    }
    //FOR TESTING PURPOSES ONLY
    async createCustomerWithoutHash(c) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO customer(customer_email, Cus_First_Name,  Cus_Last_Name, Customer_Password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
            const result = await conn.query(sql, [
                c.customer_email,
                c.cus_first_name,
                c.cus_last_name,
                c.customer_password,
                c.role_id,
            ]);
            //close connection
            conn.release;
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not create customer ${error}`);
        }
    }
    async checkEmail(email) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT customer_email FROM customer WHERE customer_email = $1";
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
    // takes email and password
    async loginCustomer(email, password) {
        try {
            //connect to database
            const conn = await database_1.default.connect();
            //get the customer details from database
            const sql = "SELECT * FROM customer WHERE customer_email = $1";
            const result = await conn.query(sql, [email]);
            conn.release();
            //check if there is a result with credintials
            if (result.rows.length) {
                const user = result.rows[0];
                //hash the current password and compare it with the customer password in the database
                if (bcrypt_1.default.compareSync(password + pepper, user.customer_password)) {
                    return user;
                }
            }
            return null;
        }
        catch (error) {
            throw new Error("An Error occured while retriving login details " + error);
        }
    }
    async updateCustomer(s) { }
}
exports.customers = customers;
