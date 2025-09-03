/**
 * User Model
 *
 * Mongoose model for application users.
 * Stores personal details, authentication credentials, addresses, and references to wishlist.
 * Supports both email/password and Google-based authentication.
 *
 * Interface:
 * - IUser: Extends mongoose Document, includes profile info, authentication details, 
 *   billing/shipping addresses, and related wishlist reference.
 *
 * Schema:
 * - firstName, lastName, displayName: Basic profile fields.
 * - googleId: For Google authentication.
 * - email: Unique, validated email address, required for all users.
 * - password: Hashed password (excluded by default from queries).
 * - hasAgreedToPrivacyPolicy: Boolean flag for compliance (required).
 * - VAT_Number, SSN_Number, GSTIN_Number: Optional tax identifiers.
 * - billingAddress, shippingAddress, alternateAddress: Address information.
 * - country, state, city, streetAddress, houseNo, landmark, pinCode: Location details.
 * - phone: User's contact number.
 * - wishlist: Reference to Wishlist collection.
 *
 * Usage:
 * - Use User model to create, authenticate, and manage users.
 * - Supports role expansion, additional references, or custom validation as needed.
 */

import mongoose, { Document, Schema } from "mongoose";

// Interface for a User document
export interface IUser extends Document {
  firstName: string; // User's first name
  lastName: string; // User's last name
  displayName: string; // Display name for profile
  googleId: string; // Google authentication ID
  email: string; // User email (unique, required)
  password: string; // User password (hashed, excluded by default in queries)
  hasAgreedToPrivacyPolicy: boolean; // Privacy policy agreement
  VAT_Number: string; // Optional VAT number
  SSN_Number: string; // Optional SSN number
  GSTIN_Number: string; // Optional GSTIN number
  billingAddress: string; // Billing address
  shippingAddress: string; // Shipping address
  country: string; // Country of residence
  streetAddress: string; // Street name/address
  houseNo: string; // House or apartment number
  alternateAddress: string; // Optional alternate address
  landmark: string; // Nearby landmark
  city: string; // City
  state: string; // State
  phone: string; // Contact number
  pinCode: string; // Postal code
  wishlist: mongoose.Types.ObjectId; // Reference to Wishlist collection
}

// Mongoose schema for User
const userSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  displayName: {
    type: String,
  },
  googleId: String, // Google OAuth ID for SSO login
  email: {
    type: String,
    required: [true, "Email is required"], // Email must be provided
    unique: true, // Ensure uniqueness
    lowercase: true, // Store email in lowercase
    trim: true, // Trim whitespace
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], // Validate format
  },
  password: {
    type: String,
    select: false, // Exclude password by default in queries
  },
  hasAgreedToPrivacyPolicy: {
    type: Boolean,
    required: true,
    default: false,
  },
  VAT_Number: {
    type: String,
  },
  SSN_Number: {
    type: String,
  },
  GSTIN_Number: {
    type: String,
  },
  billingAddress: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  country: String,
  streetAddress: String,
  houseNo: String,
  alternateAddress: String,
  landmark: String,
  city: String,
  state: String,
  phone: String,
  pinCode: String,
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wishlist", // Reference to Wishlist model
  },
});

// Create or reuse User model
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

// Export the User model
export default User;
