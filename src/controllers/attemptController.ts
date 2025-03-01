import ExamAttempt from "../models/ExamAttempt";
import express, { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import mongoose from "mongoose";
import APIFeatures from "../utils/apiFeatures";
import { ICandidate } from "../models/Candidate";

interface IAuthCandidate extends Request {
  user: ICandidate;
}

export const setCandidateId = async (
  req: IAuthCandidate,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.candidate) req.body.candidate = req.user._id;
  next();
};

export const createAttempt = catchAsync(
  async (req: IAuthCandidate, res: Response, next: NextFunction) => {
    const { exam } = req.body;
    const candidate = req.user._id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const candidateExists = await ExamAttempt.findOne({
        candidate,
        exam,
        status: "in-progress",
      });
      if (candidateExists) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(
          "An attempt with the same candidate and exam already exists",
          400
        );
      }

      const attempt = await ExamAttempt.create(
        [
          {
            candidate,
            exam,
            status: "in-progress",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: "Exam attempt created successfully",
        status: "success",
        attempt: attempt[0],
      });
    } catch (err: unknown) {
      await session.abortTransaction();
      session.endSession();
      next(
        new AppError("An error occurred while creating the exam attempt", 500)
      );
    }
  }
);

export const getAllAttempts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(ExamAttempt.find(), req.query)
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const data = await features.query.populate("exam").populate("answers");

    if (!data) {
      return next(new AppError("No attempts found", 404));
    }

    res.status(200).json({
      message: "Attempts found successfully",
      status: "success",
      data,
    });
  }
);

export const getAttempt = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const data = await ExamAttempt.findById(id)
      .populate("answers")
      .populate("exam")
      .populate("candidate", "email firstname");

    if (!data) {
      return next(new AppError("Attempt not found", 404));
    }

    res.status(200).json({
      message: "Attempt found successfully",
      status: "success",
      data,
    });
  }
);

export const updateAttempt = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateBody = req.body;

    const attempt = await ExamAttempt.findById(id);
    if (!attempt) {
      return next(new AppError("Attempt not found", 404));
    }

    if (attempt.status === "submitted" || attempt.status === "graded") {
      return next(
        new AppError("Cannot update attempt once submitted or graded", 400)
      );
    }

    if (attempt.status === "in-progress" && updateBody.status === "submitted") {
      updateBody.submittedAt = Date.now;
    }

    Object.assign(attempt, updateBody);
    await attempt.save();

    res.status(200).json({
      message: "Attempt updated successfully",
      status: "success",
      data: attempt,
    });
  }
);

export const autoGradeAttempt = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const attempt = await ExamAttempt.findById(id);
    if (!attempt) {
      return next(new AppError("Attempt not found", 404));
    }

    if (attempt.status !== "submitted") {
      return next(
        new AppError("Cannot auto grade attempt once submitted", 400)
      );
    }

    await attempt.autoGradeObjectiveQuestions();
    attempt.status = "graded";
    await attempt.save();

    res.status(200).json({
      message: "Attempt auto-graded successfully",
      status: "success",
      data: attempt,
    });
  }
);
