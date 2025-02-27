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

const candidateRouter = express.Router({
  mergeParams: true,
});

candidateRouter
  .route("/")
  .get(getAllCandidates)
  .post(setExamIds, protect, createCandidate);

candidateRouter
  .route("/:id")
  .get(getCandidate)
  .delete(protect, deleteCandidate)
  .patch(protect, updateCandidate);

export default candidateRouter;
