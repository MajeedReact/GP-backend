"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const motherboard_1 = require("../models/motherboard");
const store = new motherboard_1.motherboardClass();
const getAllmotherboard = async (_req, res) => {
    try {
        const result = await store.getAllmotherboard();
        res.json(result);
    }
    catch (err) {
        throw new Error(`An Error occured retrivingmotherboard: ${err}`);
    }
};
const motherboard_route = (app) => {
    app.get("/motherboard", getAllmotherboard);
};
exports.default = motherboard_route;
