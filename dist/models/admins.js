"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admins = void 0;
const database_1 = __importDefault(require("../database"));
class admins {
    //get all admins for admins only
    async getAllAdmins() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM admins";
            const result = await conn.query(sql);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive roles: ${err}`);
        }
    }
}
exports.admins = admins;
