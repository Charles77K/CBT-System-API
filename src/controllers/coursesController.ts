import Courses, { ICourses } from "../models/Courses";
import {
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
} from "./handlerFactory";

export const createCourse = createOne<ICourses>(Courses);

export const getAllCourses = getAll<ICourses>(Courses);

export const getCourse = getOne<ICourses>(Courses);

export const deleteCourse = deleteOne<ICourses>(Courses);

export const updateCourse = updateOne<ICourses>(Courses);
