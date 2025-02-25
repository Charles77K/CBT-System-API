import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.DATABASE?.replace(
        "<PASSWORD>",
        process.env.DATABASE_PASSWORD as string
      ) as string
    );
    console.log("connected to mongoDB DATABASE...");
  } catch (err: unknown) {
    console.error(err);
    process.exit(1); // Exit on failure
  }
};

export default connectDB;
