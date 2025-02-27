import { NextFunction, Request, Response } from "express";
import Question, { questionValidation } from "../models/Question";
// import { catchAsync } from "../utils/catchAsync";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";

export const setCourseIds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  next();
};

export const createQuestion = createOne(Question, questionValidation);

export const getAllQuestions = getAll(Question);

export const getQuestion = getOne(Question);

export const deleteQuestion = deleteOne(Question);

export const updateQuestion = updateOne(Question);
