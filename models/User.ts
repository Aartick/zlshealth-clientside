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

export interface IAddress {
  fullName: string;
  phone: string;
  email?: string; // Email (optional)
  landmark?: string; // Nearby landmark (optional)
  streetAddressHouseNo: string; // Street name/address House or apartment number
  streetAddress2?: string;
  addressType: string; // Home, Work, Other
  cityTown: string; // City or Town
  state: string; // State
  pinCode: string; // Postal code
  isDefault: boolean;
}

// Interface for a User document
export interface IUser extends Document {
  password?: string; // User password (hashed, excluded by default in queries)
  hasAgreedToPrivacyPolicy: boolean; // Privacy policy agreement
  img: {
    url: string;
    public_id: string;
  };
  fullName: string; // User's full name
  dob: string; // User's Date of Birth
  phone: string; // Mobile number
  gender: string; // User's gender
  email: string; // User email (unique, required)
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId; // Reference to Wishlist collection
  createdAt: Date;
  updatedAt: Date;
}

// Address Schema (embedded inside user)
const AddressSchema = new Schema<IAddress>({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  landmark: {
    type: String,
  },
  streetAddressHouseNo: {
    type: String,
    required: true,
  },
  streetAddress2: {
    type: String,
  },
  addressType: {
    type: String,
    required: true,
  },
  cityTown: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

// Mongoose schema for User
const userSchema: Schema<IUser> = new Schema(
  {
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
    img: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    fullName: {
      type: String,
    },
    dob: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    addresses: [AddressSchema],
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist", // Reference to Wishlist model
    },
  },
  { timestamps: true }
);

// Create or reuse User model
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

// Export the User model
export default User;
