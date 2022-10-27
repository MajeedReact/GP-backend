import express, { Request, Response } from "express";
//import express to use Request and Response
import { admin, admins } from "../models/admins";


const store = new admins();
//create object store from class admins
// async function getAllAdmins =(_req: Request, res: Response) {} 
const getAllAdmins = async (_req: Request, res: Response) => {
  try {
    const allAdmins = await store.getAllAdmins();
    res.json(allAdmins);
    //send the respone in json
  } catch (err) {
    throw new Error(`An Error occured retriving roles: ${err}`);
  }
  
};

const admin_route = (app: express.Application) => {
  app.get("/admins", getAllAdmins);
};

export default admin_route;
 