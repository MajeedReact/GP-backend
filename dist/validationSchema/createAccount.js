"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccountValidation = void 0;
const express_validator_1 = require("express-validator");
const schema = [
    express_validator_1.body("email").isEmail().withMessage("Enter a valid email address"),
    express_validator_1.body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
];
exports.createAccountValidation = schema;
