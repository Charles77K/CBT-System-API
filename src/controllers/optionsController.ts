import { Request, Response, NextFunction } from "express";
import Option from "../models/Option";
import { catchAsync } from "../utils/catchAsync";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";
import { AppError } from "../utils/appError";

export const createOption = createOne(Option);

export const createMultipleOptions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return next(new AppError("Invalid Input: No options provided", 400));
    }
    console.log(req.body);
    const options = await Option.insertMany(req.body);

    res.status(201).json({
      status: "success",
      message: "Created Successfully",
      data: options,
    });
  }
);

export const getOptions = getAll(Option, undefined, "questionId", "question");

export const getOption = getOne(Option);

export const deleteOption = deleteOne(Option);

export const updateOption = updateOne(Option);
