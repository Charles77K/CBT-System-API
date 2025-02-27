import mongoose, { Document, model, Schema } from "mongoose";
import { z } from "zod";

export interface ICandidate extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  examCode: String;
  exam: mongoose.Types.ObjectId;
  score: number | null;
  // done: boolean;
}

const candidateSchema = new Schema<ICandidate>(
  {
    firstname: String,
    lastname: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    examCode: String,
    exam: { type: Schema.Types.ObjectId, ref: "Exam" },
    score: { type: Number, default: null },
    // done: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

candidateSchema.pre("save", function (next) {
  if (!this.examCode) {
    this.examCode = Math.random().toString(36).substring(2, 7).toUpperCase();
  }
  next();
});

const Candidate = model<ICandidate>("Candidate", candidateSchema);

export default Candidate;
