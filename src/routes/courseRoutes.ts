import express from "express";
import { createCourse, getAllCourses } from "../controllers/coursesController";

const courseRouter = express.Router();

courseRouter.route("/").get(getAllCourses).post(createCourse);

courseRouter.route("/:id").get();
