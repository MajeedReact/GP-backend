import { Request, Response } from "express";
import { validationResult } from "express-validator";

export function checkEmailAndPassword(
  req: Request,
  res: Response,
  next: Function
) {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const errors = error.array();
    return res.status(400).json(errors[0].msg);
  }
  next();
}
