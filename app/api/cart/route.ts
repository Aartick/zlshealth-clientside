import Cart from "@/models/Cart";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

interface ProductDoc {
  _id: Types.ObjectId;
  category: string;
  benefits: string[];
  productTypes: string[];
  name: string;
  productImg: { url: string };
  price: number;
  discount: number;
  about: string;
}

interface CartProduct {
  productId: Types.ObjectId | ProductDoc;
  quantity: number;
}

/**
 * @route - POST /api/cart
 * @description - Add a product to the user's cart or update quantity if it already exists
 * @param req - NextRequest containing productId and quantity in JSON body.
 * @returns - Update cart with product details
 */
export async function POST(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return error(400, "All fields are required.");
    }

    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find the user's cart in the database
    let cart = await Cart.findOne({ customerId: _id });

    if (!cart) {
      // If no cart exists, create a new one with the product
      cart = await Cart.create({
        customerId: _id,
        products: [{ productId, quantity }],
      });
    } else {
      // Check if product already exists in cart
      const existingProduct = cart.products.find(
        (p: CartProduct) => p.productId.toString() === productId
      );

      if (existingProduct) {
        // If product exists, increase the quantity
        existingProduct.quantity += quantity;
      } else {
        // If product does not exist, add it to cart
        cart.products.push({ productId, quantity });
      }

      await cart.save(); // Save the updated cart
    }

    // Populate product details for response
    const updatedCart = await cart.populate("products.productId");

    // Map cart products to response format
    const responseWrapper = updatedCart.products.map((pro: CartProduct) => {
      const product = pro.productId as ProductDoc;
      return {
        _id: product._id,
        category: product.category,
        benefits: product.benefits,
        productTypes: product.productTypes,
        name: product.name,
        img: product.productImg.url,
        price: product.price,
        quantity: pro.quantity,
        discount: product.discount,
        about: product.about,
      };
    });

    return success(201, responseWrapper);
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @route - GET /api/cart
 * @description - Retrieve all products in the user's cart
 * @param req - NextRequest with JWT token for user identification
 * @returns - List of cart products with details
 */
export async function GET(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find user's cart and populate product details
    const cart = await Cart.findOne({ customerId: _id }).populate(
      "products.productId"
    );

    if (!cart) {
      return error(404, "Cart not found.");
    }

    // Map cart products to response format
    const responseWrapper = cart.products.map((pro: CartProduct) => {
      const product = pro.productId as ProductDoc;

      return {
        _id: product._id,
        category: product.category,
        benefits: product.benefits,
        productTypes: product.productTypes,
        name: product.name,
        img: product.productImg.url,
        price: product.price,
        quantity: pro.quantity,
        about: product.about,
        discount: product.discount,
      };
    });

    return success(201, responseWrapper);
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong.");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Delete the user's cart from the database
    const cart = await Cart.deleteOne({ customerId: _id });

    // Check if any cart was actually deleted
    if (cart.deletedCount === 0) {
      return error(404, "Cart not found.");
    }

    return success(200, "Cart cleared successfuly.");
  } catch (e) {
    return error(500, "Something went wrong.");
  }
}
