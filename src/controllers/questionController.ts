import { NextFunction, Request, Response } from "express";
import Question from "../models/Question";
// import { catchAsync } from "../utils/catchAsync";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";

export const createQuestion = createOne(Question);

export const getAllQuestions = getAll(Question);

export const getQuestion = getOne(Question, {
  path: "answers",
});

export const deleteQuestion = deleteOne(Question);

export const updateQuestion = updateOne(Question);
