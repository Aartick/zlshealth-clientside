/**
 * Migration Script for Coupons
 * Removes old discountAmount field if exists and ensures discountPercentage exists
 * Usage: npx tsx scripts/migrateCoupons.ts
 */

import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import { readFileSync } from "fs";
import { resolve } from "path";

// Manually load .env.local file
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join("=").trim();
      }
    }
  });
} catch (err) {
  console.log("Could not load .env.local, using existing environment variables");
}

async function migrateCoupons() {
  try {
    const MONGOURI = process.env.MONGOURI as string;

    if (!MONGOURI) {
      throw new Error("Please define MONGOURI in .env.local");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGOURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log("Connected to MongoDB!");

    // Get the raw collection to check for old fields
    const db = mongoose.connection.db;
    const couponsCollection = db?.collection("coupons");

    if (!couponsCollection) {
      throw new Error("Could not access coupons collection");
    }

    // Find all coupons
    const allCoupons = await couponsCollection.find({}).toArray();
    console.log(`\nFound ${allCoupons.length} coupons in database`);

    let migratedCount = 0;
    let alreadyCorrectCount = 0;

    for (const coupon of allCoupons) {
      console.log(`\nChecking coupon: ${coupon.code}`);

      // Check if it has the old discountAmount field
      if ('discountAmount' in coupon && !('discountPercentage' in coupon)) {
        console.log(`  ⚠️  Has old 'discountAmount' field: ${coupon.discountAmount}`);
        console.log(`  ❌ This coupon needs manual migration - cannot auto-convert amount to percentage`);
        migratedCount++;
      } else if ('discountAmount' in coupon && 'discountPercentage' in coupon) {
        console.log(`  ⚠️  Has both fields - removing old 'discountAmount' field`);
        await couponsCollection.updateOne(
          { _id: coupon._id },
          { $unset: { discountAmount: "" } }
        );
        console.log(`  ✓ Removed old field`);
        migratedCount++;
      } else if ('discountPercentage' in coupon) {
        console.log(`  ✓ Already has correct 'discountPercentage' field: ${coupon.discountPercentage}%`);
        alreadyCorrectCount++;
      } else {
        console.log(`  ❌ Missing both fields - this coupon is invalid!`);
      }
    }

    console.log(`\n=== Migration Summary ===`);
    console.log(`Total coupons: ${allCoupons.length}`);
    console.log(`Already correct: ${alreadyCorrectCount}`);
    console.log(`Migrated/Cleaned: ${migratedCount}`);

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error migrating coupons:", error);
    process.exit(1);
  }
}

migrateCoupons();
