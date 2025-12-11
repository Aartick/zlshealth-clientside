/**
 * Seed Script for Coupons
 * Run this script to add sample coupons to your database
 * Usage: node --loader tsx scripts/seedCoupons.ts
 * OR: npx tsx scripts/seedCoupons.ts
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

// Coupon Schema
const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    maxDiscountAmount: {
      type: Number,
      required: true,
    },
    minOrderAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

const sampleCoupons = [
  {
    code: "HEALTH10",
    discountPercentage: 10,
    maxDiscountAmount: 200,
    minOrderAmount: 1500,
  },
  {
    code: "FIRSTBUY",
    discountPercentage: 15,
    maxDiscountAmount: 150,
    minOrderAmount: 1000,
  },
  {
    code: "FREESHIP",
    discountPercentage: 5,
    maxDiscountAmount: 50,
    minOrderAmount: 499,
  },
  {
    code: "WELLNESS20",
    discountPercentage: 20,
    maxDiscountAmount: 300,
    minOrderAmount: 800,
  },
  {
    code: "SAVE25",
    discountPercentage: 25,
    maxDiscountAmount: 500,
    minOrderAmount: 2000,
  },
];

async function seedCoupons() {
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

    // Clear existing coupons (optional - comment out if you want to keep existing)
    // await Coupon.deleteMany({});
    // console.log("Cleared existing coupons");

    // Insert sample coupons
    for (const couponData of sampleCoupons) {
      try {
        const existingCoupon = await Coupon.findOne({ code: couponData.code });

        if (existingCoupon) {
          console.log(`✓ Coupon ${couponData.code} already exists`);
        } else {
          await Coupon.create(couponData);
          console.log(`✓ Created coupon: ${couponData.code}`);
        }
      } catch (err: any) {
        if (err.code === 11000) {
          console.log(`✓ Coupon ${couponData.code} already exists`);
        } else {
          console.error(`✗ Error creating ${couponData.code}:`, err.message);
        }
      }
    }

    console.log("\n✓ Coupon seeding completed!");

    // Fetch and display all coupons
    const allCoupons = await Coupon.find({});
    console.log(`\nTotal coupons in database: ${allCoupons.length}`);
    console.log("\nAvailable coupons:");
    allCoupons.forEach((coupon: any) => {
      console.log(
        `  - ${coupon.code}: ${coupon.discountPercentage}% off (Max ₹${coupon.maxDiscountAmount}, Min order: ₹${coupon.minOrderAmount})`
      );
    });

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error seeding coupons:", error);
    process.exit(1);
  }
}

seedCoupons();
