"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        //if there is no token
        if (!token) {
            res.status(401).json("Unauthorized");
            return;
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        //if token is invalid
        if (!decode) {
            res.status(401).json("Invalid Token");
            return;
        }
        else {
            next();
        }
    }
    catch (err) {
        res.clearCookie("token");
        const error = err;
        throw new Error(error);
    }
};
exports.default = checkAuth;
