"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gpu_1 = require("../models/gpu");
const store = new gpu_1.gpuClass();
const getAllgpus = async (_req, res) => {
    try {
        const result = await store.getAllgpus();
        res.json(result);
    }
    catch (err) {
        throw new Error(`An Error occured retriving gpu: ${err}`);
    }
};
const gpu_route = (app) => {
    app.get("/gpu", getAllgpus);
};
exports.default = gpu_route;
