import express, { Request, Response } from "express";
import { memory, memoryClass } from "../models/memory";

const store = new memoryClass();

const getAllmemory = async (_req: Request, res: Response) => {
  try {
    const result = await store.getAllmemory();
    res.json(result);
  } catch (err) {
    throw new Error(`An Error occured retriving memory: ${err}`);
  }
};

const memory_route = (app: express.Application) => {
  app.get("/memory", getAllmemory);
};

export default memory_route;
