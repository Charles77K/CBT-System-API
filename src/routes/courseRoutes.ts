import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourse,
  updateCourse,
} from "../controllers/coursesController";
import questionRouter from "./questionRoutes";

const courseRouter = express.Router();

courseRouter.use("/:courseId/question", questionRouter);

courseRouter.route("/").get(getAllCourses).post(createCourse);

courseRouter
  .route("/:id")
  .get(getCourse)
  .delete(deleteCourse)
  .patch(updateCourse);

export default courseRouter;
