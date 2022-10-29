"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmailAndPassword = void 0;
const express_validator_1 = require("express-validator");
function checkEmailAndPassword(req, res, next) {
    const error = express_validator_1.validationResult(req);
    if (!error.isEmpty()) {
        const errors = error.array();
        return res.status(400).json(errors[0].msg);
    }
    next();
}
exports.checkEmailAndPassword = checkEmailAndPassword;
