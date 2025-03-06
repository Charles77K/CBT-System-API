import mongoose, { Schema, Document, model } from "mongoose";
import Answers, { IAnswers } from "./Answers";

interface IExamAttempt {
  candidate: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalScore: number;
  maxPossibleScore: number;
  status: "in-progress" | "completed" | "graded";
  isPassed: boolean;
  submittedAnswers: number; // Count of questions answered
  totalQuestions: number;
  // Optional methods
  autoGradeObjectiveQuestions: () => Promise<IExamAttempt>;
}

// Modified ExamAttempt schema with enhanced answer handling
const ExamAttemptSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    totalScore: { type: Number, default: 0 },
    maxPossibleScore: { type: Number },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
    isPassed: { type: Boolean },
    submittedAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for answers associated with this attempt
ExamAttemptSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "attempt",
});

// Example method to add to your ExamAttempt model
ExamAttemptSchema.methods.autoGradeObjectiveQuestions = async function () {
  const answers: IAnswers[] = await Answers.find({
    attempt: this._id,
  }).populate("question");
  let totalScore = 0;

  for (const answer of answers) {
    const question = answer.question as any;

    if (question.type === "multiple-choice") {
      const correctOptionIds = question.options
        .filter(
          (option: { id: string; text: string; isCorrect: boolean }) =>
            option.isCorrect
        )
        .map((option: { id: string }) => option.id);

      const isCorrect =
        answer.selectedOptionIds.length === correctOptionIds.length &&
        answer.selectedOptionIds.every((id: string) =>
          correctOptionIds.includes(id)
        );

      answer.isCorrect = isCorrect;
      answer.score = isCorrect ? 1 : 0;
    } else if (question.type === "true-false") {
      const trueOption = question.options.find(
        (option: { id: string; text: string; isCorrect: boolean }) =>
          option.text.toLowerCase() === "true"
      );

      answer.isCorrect = answer.booleanAnswer === trueOption.isCorrect;
      answer.score = answer.isCorrect ? 1 : 0;
    }

    totalScore += answer.score;
  }

  this.totalScore = totalScore;
  return this.save();
};

const ExamAttempt = model<IExamAttempt>("ExamAttempt", ExamAttemptSchema);

export default ExamAttempt;
