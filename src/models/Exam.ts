import mongoose, { Schema, Document, model } from "mongoose";
import { z } from "zod";

export interface IExam extends Document {
  name: string;
  description: string | null;
  courses: mongoose.Types.ObjectId[];
  candidates: mongoose.Types.ObjectId[];
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
    candidates: [{ type: Schema.Types.ObjectId, ref: "Candidate" }],
    duration: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

ExamSchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<IExam, IExam>;
  query.populate("courses").populate("candidates");
  next();
});

const Exam = model<IExam>("Exam", ExamSchema);

export default Exam;
