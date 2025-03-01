import express from "express";
import {
  createCandidate,
  deleteCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidate,
} from "../controllers/candidatesController";
import { protect } from "../controllers/authController";
import { setExamIds } from "../controllers/candidatesController";
import {
  authenticateCandidate,
  loginCandidate,
  registerCandidate,
} from "../controllers/candidatesAuthentication";
import attemptRouter from "./examAttemptRoutes";

const candidateRouter = express.Router({
  mergeParams: true,
});

candidateRouter.use("/:candidateId/attempt", attemptRouter);

candidateRouter
  .route("/")
  .get(getAllCandidates)
  .post(setExamIds, authenticateCandidate, createCandidate);

candidateRouter.route("/register").post(registerCandidate);

candidateRouter.route("/login").post(loginCandidate);

candidateRouter
  .route("/:id")
  .get(getCandidate)
  .delete(protect, deleteCandidate)
  .patch(protect, updateCandidate);

export default candidateRouter;
