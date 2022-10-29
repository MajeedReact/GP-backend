"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_1 = require("../models/memory");
const store = new memory_1.memoryClass();
const getAllmemory = async (_req, res) => {
    try {
        const result = await store.getAllmemory();
        res.json(result);
    }
    catch (err) {
        throw new Error(`An Error occured retriving memory: ${err}`);
    }
};
const memory_route = (app) => {
    app.get("/memory", getAllmemory);
};
exports.default = memory_route;
