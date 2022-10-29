"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class authorization {
    //posting product
    checkSellerOrAdmin(req, res, next) {
        try {
            var token = req.cookies.token;
            var result = jsonwebtoken_1.default.decode(token);
            if (result.role_id == 2 || result.role_id == 3) {
                next();
            }
            else {
                res.json("You are not a seller nor an admin");
                return;
            }
        }
        catch (error) {
            throw new Error("An Error occured " + error);
        }
    }
    //admin role only
    adminRole(req, res, next) {
        var token = req.cookies.token;
        var result = jsonwebtoken_1.default.decode(token);
        if (result.role_id == 3) {
            next();
        }
        else {
            res.json("Unauthorized");
            return;
        }
    }
    isCustomer(req, res, next) {
        const token = req.cookies.token;
        var decode = jsonwebtoken_1.default.decode(token);
        //check if user
        if (decode.role_id == 1 || decode.role_id == 3) {
            next();
        }
        else {
            res.status(403);
            res.json("Forbidden");
        }
    }
}
exports.authorization = authorization;
