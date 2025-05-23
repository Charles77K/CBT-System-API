import { Response, Request, NextFunction } from "express";

type AsyncFunction = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
