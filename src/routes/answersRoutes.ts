import express from "express";
import { authenticateCandidate } from "../controllers/candidatesAuthentication";
import { setQuestionId } from "../controllers/middlewares";
import {
  getAllAnswers,
  gradeAnswer,
  submitAnswer,
  updateAnswer,
} from "../controllers/answersController";

const answerRouter = express.Router({
  mergeParams: true,
});

answerRouter.use(authenticateCandidate);

answerRouter.route("/").post(setQuestionId, submitAnswer).get(getAllAnswers);

answerRouter.route("/:id").patch(updateAnswer).post(gradeAnswer);

export default answerRouter;
