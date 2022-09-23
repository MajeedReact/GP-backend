import express, { Request, Response } from "express";
import { gpu, gpuClass } from "../models/gpu";

const store = new gpuClass();

const getAllgpus = async (_req: Request, res: Response) => {
  try {
    const result = await store.getAllgpus();
    res.json(result);
  } catch (err) {
    throw new Error(`An Error occured retriving gpu: ${err}`);
  }
};

const gpu_route = (app: express.Application) => {
  app.get("/gpu", getAllgpus);
};

export default gpu_route;
