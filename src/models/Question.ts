import mongoose, { Schema, Document, model } from "mongoose";
import { z } from "zod";

export interface IQuestion extends Document {
  text: string;
  type: "multiple-choice" | "true-false" | "essay";
  course: mongoose.Types.ObjectId;
  difficulty: "easy" | "medium" | "hard";
}

const QuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "essay"],
      required: true,
      index: true,
    },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

QuestionSchema.virtual("answers", {
  ref: "Answers",
  localField: "_id",
  foreignField: "question",
});

QuestionSchema.virtual("options", {
  ref: "Option",
  localField: "_id",
  foreignField: "question",
});

const Question = model<IQuestion>("Question", QuestionSchema);

export default Question;
