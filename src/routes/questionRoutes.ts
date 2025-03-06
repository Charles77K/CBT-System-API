import express from "express";
import {
  getAllQuestions,
  createQuestion,
  getQuestion,
  deleteQuestion,
  updateQuestion,
} from "../controllers/questionController";
import { protect } from "../controllers/authController";
import answerRouter from "./answersRoutes";
import { setCourseIds } from "../controllers/middlewares";

const questionRouter = express.Router({ mergeParams: true });

questionRouter.use("/:id/answer", answerRouter);

questionRouter
  .route("/")
  .get(getAllQuestions)
  .post(protect, setCourseIds, createQuestion);

questionRouter
  .route("/:id")
  .get(getQuestion)
  .delete(protect, deleteQuestion)
  .patch(protect, updateQuestion);

export default questionRouter;
