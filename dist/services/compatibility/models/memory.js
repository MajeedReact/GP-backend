"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryClass = void 0;
const database_1 = __importDefault(require("../../../database"));
class memoryClass {
    async getAllmemory() {
        try {
            //wait the response from server
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM memory";
            const result = await conn.query(sql);
            //close the connection
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not retrive memory: ${err}`);
        }
    }
}
exports.memoryClass = memoryClass;
