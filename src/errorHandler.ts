import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err?.statusCode) {
    return res.status(err.statusCode).send(err.message);
  }
  return res.status(500).send(err);
};
