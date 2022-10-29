"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessRoles = void 0;
const database_1 = __importDefault(require("../database"));
class accessRoles {
    //get all roles for admins only
    async getAllRoles() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM roles";
            const result = await conn.query(sql);
            //close the connection
            conn.release();
            if (result.rowCount < 5) {
                console.log("less than 5");
            }
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive roles: ${err}`);
        }
    }
}
exports.accessRoles = accessRoles;
