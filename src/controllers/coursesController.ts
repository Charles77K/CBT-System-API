import Courses, { ICourses } from "../models/Courses";
import {
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
} from "./handlerFactory";

export const createCourse = createOne<ICourses>(Courses);

export const getAllCourses = getAll<ICourses>(
  Courses,
  undefined,
  "questionId",
  "question"
);

export const getCourse = getOne<ICourses>(Courses, {
  path: "questions",
  select: "_id title description options",
});

export const deleteCourse = deleteOne<ICourses>(Courses);

export const updateCourse = updateOne<ICourses>(Courses);
