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
  loginCandidate,
  registerCandidate,
} from "../controllers/candidatesAuthentication";

const candidateRouter = express.Router({
  mergeParams: true,
});

candidateRouter
  .route("/")
  .get(setExamIds, getAllCandidates)
  .post(setExamIds, protect, createCandidate);

candidateRouter.route("/register").post(registerCandidate);

candidateRouter.route("/login").post(loginCandidate);

candidateRouter
  .route("/:id")
  .get(getCandidate)
  .delete(protect, deleteCandidate)
  .patch(protect, updateCandidate);

export default candidateRouter;
