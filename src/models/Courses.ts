import mongoose, { Schema, model, Document } from "mongoose";

export interface ICourses extends Document {
  title: string;
  description: string;
  questions: Schema.Types.ObjectId[];
}

const CourseSchema = new Schema<ICourses>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Courses = model<ICourses>("Course", CourseSchema);

export default Courses;
