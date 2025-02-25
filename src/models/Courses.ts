import mongoose, { Schema, model, Document } from "mongoose";

export interface ICourses extends Document {
  title: string;
  description: string;
}

const CourseSchema = new Schema<ICourses>({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Courses = model<ICourses>("Course", CourseSchema);

export default Courses;
