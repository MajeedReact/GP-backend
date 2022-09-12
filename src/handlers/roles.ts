import express, { Request, Response } from "express";
import { roles, accessRoles } from "../models/Roles";

const store = new accessRoles();

//admin use only
const getAllRoles = async (_req: Request, res: Response) => {
  try {
    const allRoles = await store.getAllRoles();
    res.json(allRoles);
  } catch (err) {
    throw new Error(`An Error occured retriving roles: ${err}`);
  }
};

const roles_route = (app: express.Application) => {
  app.get("/roles", getAllRoles);
};

export default roles_route;
