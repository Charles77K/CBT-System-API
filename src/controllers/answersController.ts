import Answers from "../models/Answers";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { getAll } from "./handlerFactory";

export const submitAnswer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      question,
      attempt,
      selectedOptionsIds,
      booleanAnswer,
      essayAnswer,
      score,
      timeSpent,
    } = req.body;

    const existingAnswer = await Answers.findOne({
      question,
      attempt,
    });
    if (existingAnswer) {
      return next(
        new AppError("Answer for this question already submitted", 400)
      );
    }

    const answer = await Answers.create({
      question,
      attempt,
      selectedOptionsIds: selectedOptionsIds || [],
      booleanAnswer,
      essayAnswer,
      score: 0,
      timeSpent,
      isCorrect: false,
    });

    res.status(201).json({
      status: "success",
      message: "Answer created successfully",
      data: answer,
    });
  }
);

export const getAllAnswers = getAll(Answers, [
  {
    path: "question",
  },
  { path: "attempt" },
]);

export const updateAnswer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.questionRouter;
    delete updateData.attempt;

    const answer = await Answers.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!answer) {
      return next(new AppError(`No answer found with id ${id}`, 404));
    }

    res.status(200).json({
      status: "success",
      message: "Answer updated successfully",
      data: answer,
    });
  }
);

export const gradeAnswer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { score, feedback, isCorrect } = req.body;

    const answer = await Answers.findByIdAndUpdate(id, {
      score,
      feedback,
      isCorrect,
    });

    if (!answer)
      return next(new AppError(`No answer found with id ${id}`, 404));

    res.status(200).json({
      status: "success",
      message: "Answer graded successfully",
      data: answer,
    });
  }
);
