import { Document, Schema, model } from "mongoose";

export interface IAnswers extends Document {
  question: Schema.Types.ObjectId;
  attempt: Schema.Types.ObjectId;
  selectedOptionIds: string[];
  booleanAnswer: boolean;
  essayAnswer: string;
  score: number;
  feedback: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

const answerSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  attempt: {
    type: Schema.Types.ObjectId,
    ref: "ExamAttempt",
    required: true,
  },
  selectedOptionIds: [{ type: String, required: true }],
  booleanAnswer: { type: Boolean },
  essayAnswer: { type: String },
  score: { type: Number, default: 0 },
  feedback: { type: String },
  isCorrect: { type: Boolean },
  timeSpent: { type: Number },
});

const Answers = model<IAnswers>("Answers", answerSchema);

export default Answers;
