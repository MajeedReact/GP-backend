"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cpu_1 = require("../models/cpu");
const store = new cpu_1.cpuClass();
const getAllcpus = async (_req, res) => {
    try {
        const result = await store.getAllcpus();
        res.json(result);
    }
    catch (err) {
        throw new Error(`An Error occured retriving cpu: ${err}`);
    }
};
const cpu_route = (app) => {
    app.get("/cpu", getAllcpus);
};
exports.default = cpu_route;
