"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import express to use Request and Response
const admins_1 = require("../models/admins");
const store = new admins_1.admins();
//create object store from class admins
// async function getAllAdmins =(_req: Request, res: Response) {} 
const getAllAdmins = async (_req, res) => {
    try {
        const allAdmins = await store.getAllAdmins();
        res.json(allAdmins);
        //send the respone in json
    }
    catch (err) {
        throw new Error(`An Error occured retriving roles: ${err}`);
    }
};
const admin_route = (app) => {
    app.get("/admins", getAllAdmins);
};
exports.default = admin_route;
