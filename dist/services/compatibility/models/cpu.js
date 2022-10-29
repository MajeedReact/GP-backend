"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cpuClass = void 0;
const database_1 = __importDefault(require("../../../database"));
class cpuClass {
    async getAllcpus() {
        try {
            //wait the response from server
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM cpu";
            const result = await conn.query(sql);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive cpu: ${err}`);
        }
    }
}
exports.cpuClass = cpuClass;
