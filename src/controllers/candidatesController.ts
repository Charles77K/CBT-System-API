import Candidate, { ICandidate } from "../models/Candidate";
import express, { Request, Response, NextFunction } from "express";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";
import { catchAsync } from "../utils/catchAsync";

export const getAllCandidates = getAll<ICandidate>(Candidate);

export const createCandidate = createOne<ICandidate>(Candidate);

export const getCandidate = getOne<ICandidate>(Candidate);

export const deleteCandidate = deleteOne<ICandidate>(Candidate);

export const updateCandidate = updateOne<ICandidate>(Candidate);
