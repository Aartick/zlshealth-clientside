// dbConnect/dbConnect.ts
import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";

const MONGOURI = process.env.MONGOURI as string;

if (!MONGOURI) {
  throw new Error("Please define MONGOURI in .env.local");
}

const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGOURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log("<<<:::MONGODB CONNECTED:::>>>");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default dbConnect;
