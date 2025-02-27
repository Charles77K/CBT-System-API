import mongoose, { Schema, Document, model } from "mongoose";
import { z } from "zod";

interface IQuestion extends Document {
  text: string;
  type: "multiple-choice" | "true-false" | "essay";
  course: mongoose.Types.ObjectId;
  options?: {
    text: string;
    isCorrect: boolean;
  }[];
  difficulty: "easy" | "medium" | "hard";
}

export const questionValidation = z
  .object({
    text: z
      .string()
      .min(5, "Question should be at least 5 characters long")
      .max(500),

    course: z.string().min(1, "Course is required"),

    type: z.enum(["multiple-choice", "true-false", "essay"]),

    options: z
      .array(
        z.object({
          text: z
            .string()
            .min(2, "Option text should be at least 2 characters long"),
          isCorrect: z.boolean(),
        })
      )
      .optional(),

    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "multiple-choice") {
        return (
          data.options && data.options.length >= 2 && data.options.length <= 4
        );
      }
      if (data.type === "true-false") {
        return data.options && data.options.length === 2;
      }
      if (data.type === "essay") {
        return !data.options || data.options.length === 0;
      }
      return true;
    },
    {
      message: "Invalid options for the selected question type",
      path: ["options"],
    }
  );

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
    options: [
      {
        text: { type: String },
        isCorrect: { type: Boolean },
      },
    ],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

// Separate validation logic to middleware
QuestionSchema.path("options").validate(function (options) {
  if (this.type === "multiple-choice" || this.type === "true-false") {
    return options && options.length > 0;
  }
  return true;
});

const Question = model<IQuestion>("Question", QuestionSchema);

export default Question;
