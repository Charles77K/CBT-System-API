import mongoose, { Schema, Document, model } from "mongoose";
import { z } from "zod";

export interface IExam extends Document {
  name: string;
  description: string | null;
  courses: mongoose.Types.ObjectId[];
  duration: number;
}

export const examValidation = z.object({
  name: z.string().min(3).max(100),
  description: z.string().nullable().optional(),
  duration: z.number().min(1).positive(),
});

const ExamSchema = new Schema<IExam>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    courses: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    duration: { type: Number, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

ExamSchema.virtual("candidates", {
  ref: "Candidate",
  foreignField: "exam",
  localField: "_id",
});

const Exam = model<IExam>("Exam", ExamSchema);

export default Exam;
