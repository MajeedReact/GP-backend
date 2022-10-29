"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Roles_1 = require("../models/Roles");
const store = new Roles_1.accessRoles();
//admin use only
const getAllRoles = async (_req, res) => {
    try {
        const allRoles = await store.getAllRoles();
        res.json(allRoles);
    }
    catch (err) {
        throw new Error(`An Error occured retriving roles: ${err}`);
    }
};
const roles_route = (app) => {
    app.get("/roles", getAllRoles);
};
exports.default = roles_route;
