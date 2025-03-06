import mongoose, { Document, model, Schema } from "mongoose";
import validator from "validator";
import { z } from "zod";
import bcrypt from "bcrypt";

export interface IAdmin extends Document {
  _id: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  createdAt: Date;
  correctPassword: (candidatePassword: string) => Promise<boolean>;
}

export const adminValidation = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase character" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase character" }),
  passwordConfirm: z.string(),
});

const adminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el: string) {
        return el === (this as any).password;
      },
      message: "Passwords don't match",
    },
  },
  createdAt: { type: Date, default: Date.now() },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

adminSchema.methods.correctPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = model<IAdmin>("Admin", adminSchema);

export default Admin;
