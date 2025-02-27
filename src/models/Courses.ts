import mongoose, { Schema, model, Document } from "mongoose";

export interface ICourses extends Document {
  title: string;
  description: string;
}

const CourseSchema = new Schema<ICourses>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CourseSchema.virtual("questions", {
  ref: "Question",
  foreignField: "course",
  localField: "_id",
});

const Courses = model<ICourses>("Course", CourseSchema);

export default Courses;
