import express from "express";
import {
  autoGradeAttempt,
  createAttempt,
  getAllAttempts,
  getAttempt,
  updateAttempt,
} from "../controllers/attemptController";
import { authenticateCandidate } from "../controllers/candidatesAuthentication";

const attemptRouter = express.Router({ mergeParams: true });

attemptRouter.use(authenticateCandidate);

attemptRouter.route("/").post(createAttempt).get(getAllAttempts);

attemptRouter.route("/:id").patch(updateAttempt).get(getAttempt);

attemptRouter.route("/grade").post(autoGradeAttempt);

export default attemptRouter;
