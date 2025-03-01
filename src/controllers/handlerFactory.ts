import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Model as MongooseModel, PopulateOption } from "mongoose";
import APIFeatures from "../utils/apiFeatures";
import { AppError } from "../utils/appError";
import { ZodSchema } from "zod";

interface IPopulateOptions {
  path: string;
  select?: string;
}

export const createOne = <T>(Model: MongooseModel<T>, validation?: ZodSchema) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let content = req.body;

    if (validation) {
      const parsedCandidate = validation.safeParse(req.body);

      if (!parsedCandidate.success) {
        const errorMessage = Object.values(
          parsedCandidate.error.flatten().fieldErrors
        )
          .flat()
          .join(", ");
        return next(new AppError(`Invalid Input: ${errorMessage}`, 400));
      }

      content = parsedCandidate.data;
    }

    const data = await Model.create(content);

    res.status(201).json({
      status: "success",
      message: "Created Successfully",
      data,
    });
  });

export const getAll = <T>(
  Model: MongooseModel<T>,
  popOptions?: IPopulateOptions[] | IPopulateOptions
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let query = features.query;

    if (popOptions) {
      if (Array.isArray(popOptions)) {
        popOptions.forEach((option) => {
          query = query.populate(option);
        });
      } else {
        query = query.populate(popOptions);
      }
    }

    const data = await query;

    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  });

export const getOne = <T>(
  Model: MongooseModel<T>,
  popOptions?: { path: string; select?: string }
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (popOptions) query = query?.populate(popOptions);

    const data = await query;

    if (!data) {
      return next(new AppError(`No field found with id ${id}`, 404));
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const deleteOne = <T>(Model: MongooseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const data = await Model.findByIdAndDelete(id);

    if (!data) return next(new AppError(`No field found with id ${id}`, 404));

    res.status(204).json({
      status: "success",
      message: "Deleted Successfully",
    });
  });

export const updateOne = <T>(Model: MongooseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return next(new AppError(`No field found with id ${id}`, 404));
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });
