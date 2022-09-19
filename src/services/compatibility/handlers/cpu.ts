import express, { Request, Response } from "express";
import { cpu, cpuClass } from "../models/cpu";

const store = new cpuClass();

const getAllcpus = async (_req: Request, res: Response) => {
  try {
    const result = await store.getAllcpus();
    res.json(result);
  } catch (err) {
    throw new Error(`An Error occured retriving cpu: ${err}`);
  }
};

const cpu_route = (app: express.Application) => {
  app.get("/cpu", getAllcpus);
};

export default cpu_route;
