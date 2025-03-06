import mongoose, { Schema, Document, model } from "mongoose";

// Option Model
export interface IOption extends Document {
  text: string;
  isCorrect: boolean;
  question: mongoose.Types.ObjectId;
}

const OptionSchema = new Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  {
    timestamps: true,
  }
);

const Option = model<IOption>("Option", OptionSchema);

export default Option;
