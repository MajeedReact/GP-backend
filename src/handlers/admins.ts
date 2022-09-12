import express, { Request, Response } from "express";
import { admin, admins } from "../models/admins";

const store = new admins();

const getAllAdmins = async (_req: Request, res: Response) => {
  try {
    const allAdmins = await store.getAllAdmins();
    res.json(allAdmins);
  } catch (err) {
    throw new Error(`An Error occured retriving roles: ${err}`);
  }
};

const admin_route = (app: express.Application) => {
  app.get("/admins", getAllAdmins);
};

export default admin_route;
