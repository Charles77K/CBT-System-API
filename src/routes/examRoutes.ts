import express from "express";
import {
  createExam,
  deleteExam,
  getAllExams,
  getExam,
  updateExam,
} from "../controllers/ExamController";
import { protect } from "../controllers/authController";
import candidateRouter from "./candidateRoutes";

const examRouter = express.Router();

examRouter.use("/:examId/candidate", candidateRouter);

examRouter.route("/").get(getAllExams).post(createExam);

examRouter
  .route("/:id")
  .get(getExam)
  .delete(protect, deleteExam)
  .patch(updateExam);

export default examRouter;
