import Candidate, { ICandidate } from "../models/Candidate";
import { Request, Response, NextFunction } from "express";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";

export const setExamIds = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.exam) req.body.exam = req.params.examId;
  next();
};

export const getAllCandidates = getAll<ICandidate>(
  Candidate,
  undefined,
  "examId",
  "exam"
);

export const createCandidate = createOne<ICandidate>(Candidate);

export const getCandidate = getOne<ICandidate>(Candidate, {
  path: "attempt",
});

export const deleteCandidate = deleteOne<ICandidate>(Candidate);

export const updateCandidate = updateOne<ICandidate>(Candidate);
