import express from "express";
import {
  autoGradeAttempt,
  createAttempt,
  getAllAttempts,
  getAttempt,
  // setAttemptQuestionId,
  updateAttempt,
} from "../controllers/attemptController";
import { authenticateCandidate } from "../controllers/candidatesAuthentication";

const attemptRouter = express.Router();

attemptRouter.use(authenticateCandidate);

attemptRouter.route("/").post(createAttempt).get(getAllAttempts);

attemptRouter.route("/:id").patch(updateAttempt).get(getAttempt);

attemptRouter.route("/grade/:id").post(autoGradeAttempt);

export default attemptRouter;
