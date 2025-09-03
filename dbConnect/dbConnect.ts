/**
 * dbConnect Utility
 * Handles MongoDB connection using mongoose.
 *
 * Usage:
 * - Ensures a single connection to MongoDB for the app.
 * - Throws error if MONGOURI is not set in environment.
 * - Uses ServerApiVersion for strict and deprecation error settings.
 * - Logs connection status and exits process on failure.
 *
 * Functions:
 * - dbConnect: Connects to MongoDB if not already connected.
 */

import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";

// Get MongoDB URI from environment variables
const MONGOURI = process.env.MONGOURI as string;

// Throw error if URI is missing
if (!MONGOURI) {
  throw new Error("Please define MONGOURI in .env.local");
}

// Main connection function
const dbConnect = async () => {
  try {
    // If already connected, do nothing
    if (mongoose.connection.readyState >= 1) return;

    // Connect to MongoDB with server API options
    await mongoose.connect(MONGOURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    // Log successful connection
    console.log("<<<:::MONGODB CONNECTED:::>>>");
  } catch (error) {
    // Log error and exit process
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default dbConnect;
