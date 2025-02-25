import express from "express";
import {
  createCandidate,
  deleteCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidate,
} from "../controllers/candidatesController";
import { protect } from "../controllers/authController";

const candidateRouter = express.Router();

candidateRouter.route("/").get(getAllCandidates).post(protect, createCandidate);

candidateRouter
  .route("/:id")
  .get(getCandidate)
  .delete(protect, deleteCandidate)
  .patch(protect, updateCandidate);

export default candidateRouter;
