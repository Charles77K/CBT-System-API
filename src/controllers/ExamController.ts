import Exam, { IExam } from "../models/Exam";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";

export const createExam = createOne(Exam);

export const getAllExams = getAll<IExam>(Exam);

export const getExam = getOne<IExam>(Exam, {
  path: "candidates",
  select: "_id examcode email phone",
});

export const updateExam = updateOne<IExam>(Exam);

export const deleteExam = deleteOne(Exam);
