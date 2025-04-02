import express from "express";
import { setQuestionId } from "../controllers/middlewares";
import {
  createMultipleOptions,
  createOption,
  deleteOption,
  getOption,
  getOptions,
  updateOption,
} from "../controllers/optionsController";
import { authenticateCandidate } from "../controllers/candidatesAuthentication";

const optionRouter = express.Router({
  mergeParams: true,
});

optionRouter
  .route("/")
  .get(getOptions)
  .post(authenticateCandidate, setQuestionId, (req, res, next) => {
    Array.isArray(req.body)
      ? createMultipleOptions(req, res, next)
      : createOption(req, res, next);
  });

optionRouter
  .route("/:id")
  .get(getOption)
  .patch(updateOption)
  .delete(deleteOption);

export default optionRouter;
