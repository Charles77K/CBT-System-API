import express from "express";
import {
  createExam,
  deleteExam,
  getAllExams,
  getExam,
  updateExam,
} from "../controllers/ExamController";

const examRouter = express.Router();

examRouter.route("/").get(getAllExams).post(createExam);

examRouter.route("/:id").get(getExam).delete(deleteExam).patch(updateExam);

export default examRouter;
