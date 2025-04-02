import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { IAuthCandidate } from "./attemptController";

export const setCandidateId = catchAsync(
  async (req: IAuthCandidate, res: Response, next: NextFunction) => {
    if (!req.body.candidate) req.body.candidate = req.user._id;
    next();
  }
);
export const setAttemptExamId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.question) req.body.question = req.params.questionId;
    next();
  }
);

export const setCourseIds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  next();
};

export const setQuestionId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.question && Array.isArray(req.body)) {
      req.body.map((option) => (option.question = req.params.questionId));
    } else {
      req.body.question = req.params.questionId;
    }
    next();
  }
);
