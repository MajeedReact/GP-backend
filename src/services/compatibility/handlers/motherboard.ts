import express, { Request, Response } from "express";
import { motherboard, motherboardClass } from "../models/motherboard";

const store = new motherboardClass();

const getAllmotherboard = async (_req: Request, res: Response) => {
  try {
    const result = await store.getAllmotherboard();
    res.json(result);
  } catch (err) {
    throw new Error(`An Error occured retrivingmotherboard: ${err}`);
  }
};

const motherboard_route = (app: express.Application) => {
  app.get("/motherboard", getAllmotherboard);
};

export default motherboard_route;
