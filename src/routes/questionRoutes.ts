import express from "express";
import {
  getAllQuestions,
  createQuestion,
  getQuestion,
  deleteQuestion,
  updateQuestion,
  setCourseIds,
} from "../controllers/questionController";
import { protect } from "../controllers/authController";

const questionRouter = express.Router({ mergeParams: true });

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
