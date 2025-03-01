import mongoose, { Schema, Document, model } from "mongoose";
import Answers, { IAnswers } from "./Answers";

interface IExamAttempt {
  _id?: string;
  candidate: mongoose.Types.ObjectId | string;
  exam: mongoose.Types.ObjectId | string;
  startedAt: Date;
  submittedAt?: Date;
  totalScore?: number;
  status: "in-progress" | "submitted" | "graded";
  answers: mongoose.Types.ObjectId[];
  // Optional methods
  autoGradeObjectiveQuestions: () => Promise<IExamAttempt>;
}

// Modified ExamAttempt schema with enhanced answer handling
const ExamAttemptSchema = new Schema<IExamAttempt>({
  candidate: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
  exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  totalScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["in-progress", "submitted", "graded"],
    default: "in-progress",
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answers",
    },
  ],
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
