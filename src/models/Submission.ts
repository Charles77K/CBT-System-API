import mongoose, { Schema, Document, model } from "mongoose";

interface IExamAttempt {
  _id?: string;
  candidate: mongoose.Types.ObjectId | string;
  exam: mongoose.Types.ObjectId | string;
  startedAt: Date;
  submittedAt?: Date;
  totalScore: number;
  status: "in-progress" | "submitted" | "graded";
  answers: {
    question: { type: Schema.Types.ObjectId; ref: "Question"; required: true };
    selectedOptionIds: [{ type: String }];
    booleanAnswer: { type: Boolean };
    essayAnswer: { type: String };
    score: { type: Number; default: 0 };
    feedback: { type: String };
    isCorrect: { type: Boolean };
    timeSpent: { type: Number }; // in seconds
  }[];
  // Optional methods
  autoGradeObjectiveQuestions?: () => Promise<IExamAttempt>;
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
      question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      // For multiple-choice: store option ID or IDs (if multiple selections allowed)
      selectedOptionIds: [{ type: String }],
      // For true/false: store boolean representation
      booleanAnswer: { type: Boolean },
      // For essay: store text response
      essayAnswer: { type: String },
      // Scoring
      score: { type: Number, default: 0 },
      // Feedback (especially important for essays)
      feedback: { type: String },
      // Auto-evaluated correctness (for multiple-choice and true/false)
      isCorrect: { type: Boolean },
      // Time spent on this question (optional, for analytics)
      timeSpent: { type: Number }, // in seconds
    },
  ],
});

// Example method to add to your ExamAttempt model
ExamAttemptSchema.methods.autoGradeObjectiveQuestions = async function () {
  let totalScore = 0;

  for (const answer of this.answers) {
    // Fetch the full question document to access options
    const question = await mongoose.model("Question").findById(answer.question);

    if (question.type === "multiple-choice") {
      // Get correct option IDs
      const correctOptionIds = question.options
        .filter(
          (option: { id: string; text: string; isCorrect: boolean }) =>
            option.isCorrect
        )
        .map((option: { id: string }) => option.id);

      // Check if selected options match correct options
      const isCorrect =
        answer.selectedOptionIds.length === correctOptionIds.length &&
        answer.selectedOptionIds.every((id: string) =>
          correctOptionIds.includes(id)
        );

      answer.isCorrect = isCorrect;
      answer.score = isCorrect ? 1 : 0; // Basic scoring
    } else if (question.type === "true-false") {
      // Find the "true" option and check if it's correct
      const trueOption = question.options.find(
        (option: { id: string; text: string; isCorrect: boolean }) =>
          option.text.toLowerCase() === "true"
      );
      answer.isCorrect = answer.booleanAnswer === trueOption.isCorrect;
      answer.score = answer.isCorrect ? 1 : 0;
    }
    // Essay questions require manual grading

    totalScore += answer.score;
  }

  this.totalScore = totalScore;
  return this.save();
};

const Submission = model<IExamAttempt>("Answer", ExamAttemptSchema);

export default Submission;
