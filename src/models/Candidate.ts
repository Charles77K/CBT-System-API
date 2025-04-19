import mongoose, { Document, model, Schema } from "mongoose";
import { z } from "zod";

export interface ICandidate extends Document {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  examCode?: String;
  exam: mongoose.Types.ObjectId;
  attempt: mongoose.Types.ObjectId;
  verifyExamCode: (examCode: string) => boolean;
}

export const candidateValidation = z.object({
  firstname: z
    .string()
    .min(2, "firstname should have a minimum of 2 characters")
    .max(50),
  lastname: z
    .string()
    .min(2, "lastname should have a minimum of 2 characters")
    .max(50),
  email: z.string().email("invalid email address"),
  phone: z.string().min(10).max(15),
});

const candidateSchema = new Schema<ICandidate>(
  {
    firstname: String,
    lastname: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    examCode: String,
    exam: { type: Schema.Types.ObjectId, ref: "Exam" },
    attempt: { type: Schema.Types.ObjectId, ref: "ExamAttempt" },
  },
  {
    timestamps: true,
  }
);

candidateSchema.index({ exam: 1 });

async function generateUniqueCodes(): Promise<string> {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  const candidateExists = await Candidate.findOne({ examCode: code });
  return candidateExists ? generateUniqueCodes() : code;
}

candidateSchema.pre("save", async function (next) {
  if (!this.examCode) {
    this.examCode = await generateUniqueCodes();
  }

  next();
});

candidateSchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<any, ICandidate>;
  query
    .populate({
      path: "exam",
      select: "name description",
    })
    .populate("attempt");
  next();
});

candidateSchema.methods.verifyExamCode = function (examCode: string) {
  return this.examCode === examCode;
};

const Candidate = model<ICandidate>("Candidate", candidateSchema);

export default Candidate;
