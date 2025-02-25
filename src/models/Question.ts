import mongoose, { Schema, Document, model } from "mongoose";
import { z } from "zod";

interface IQuestion extends Document {
  text: string;
  type: "multiple-choice" | "true-false" | "essay";
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  rubric?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export const questionValidation = z.object({
  exam: z.string(),
  text: z
    .string()
    .min(5, "question should be at least 5 characters long")
    .max(500),
  options: z
    .array(
      z.object({
        text: z
          .string()
          .min(2, "Option text should be at least 2 characters long"),
        isCorrect: z.boolean(),
      })
    )
    .min(4, "At least two options should be provided"),
  type: z.enum(["multiple-choice", "true-false", "essay"]),
});

const QuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "essay"],
      required: true,
      index: true,
    },
    options: [
      {
        id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(), // Unique ID for each option
        },
        text: {
          type: String,
          required: function (this: { type: string }) {
            return (
              this.type === "multiple-choice" || this.type === "true-false"
            );
          },
        },
        isCorrect: {
          type: Boolean,
          required: function (this: { type: string }) {
            return (
              this.type === "multiple-choice" || this.type === "true-false"
            );
          },
        },
      },
    ],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt fields automatically
  }
);

const Question = model<IQuestion>("Question", QuestionSchema);

export default Question;
