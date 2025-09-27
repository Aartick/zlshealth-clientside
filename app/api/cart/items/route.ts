import Cart from "@/models/Cart";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

interface ProductDoc {
  _id: Types.ObjectId;
  name: string;
  productImg: { url: string };
  price: number;
  about: string;
  discount: number;
}

interface CartProduct {
  productId: Types.ObjectId | ProductDoc;
  quantity: number;
}

/**
 * @route - POST /api/cart/items
 * @description - Merge products from client into user's cart. If product exists, increment quantity.
 * @param req - NextRequest containing an array of products [{productId, quantity}]
 * @returns - Success message after merging cart
 */
export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!products || !Array.isArray(products)) {
      return error(400, "Products are required");
    }

    // Verify JWT and extract user ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find customer cart
    let cart = await Cart.findOne({ customerId: _id });

    if (!cart) {
      // If no cart exists, create a new cart with the products
      cart = await Cart.create({
        customerId: _id,
        products,
      });
    } else {
      // If cart exists, merge products
      for (const p of products) {
        const existing = cart.products.find(
          (prod: CartProduct) => prod.productId.toString() === p.productId
        );
        if (existing) {
          // Increment quantity if product already exists
          existing.quantity += p.quantity;
        } else {
          // Add new product to cart
          cart.products.push(p);
        }
      }
      await cart.save(); // Save updated cart
    }

    return success(200, "Cart merged successfully.");
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @route - PUT /api/cart/items
 * @description - Decrease quantity of a product by 1 in user's cart. Remove if quantity reaches 0.
 * @param req - NextRequest containing productId in JSON body
 * @returns - Updated cart with product details
 */

export async function PUT(req: NextRequest) {
  try {
    // Verify JWT and extract user ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const { productId } = await req.json();

    if (!productId) {
      return error(400, "Product ID is required.");
    }

    // Find cart of customer
    const cart = await Cart.findOne({ customerId: _id });

    if (!cart) {
      return error(404, "Cart not found.");
    }

    // Find product index
    const productIndex = cart.products.findIndex(
      (p: CartProduct) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return error(404, "Product not found in cart.");
    }

    // Decrease quantity by 1
    cart.products[productIndex].quantity -= 1;

    // Remove product if quantity <= 0
    if (cart.products[productIndex].quantity <= 0) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save(); // Save updated cart

    // Populate product details for response
    const updatedCart = await cart.populate("products.productId");

    // Map cart products to response format
    const responseWrapper = updatedCart.products.map((pro: CartProduct) => {
      const product = pro.productId as ProductDoc;
      return {
        _id: product._id,
        name: product.name,
        img: product.productImg.url,
        price: product.price,
        quantity: pro.quantity,
        about: product.about,
        discount: product.discount,
      };
    });

    return success(200, responseWrapper);
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong.");
  }
}

/**
 * @route - DELETE /api/cart/items
 * @description - Remove a product completely from user's cart
 * @param req - NextRequest containing productId as query parameter
 * @returns - Success message after removing product
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return error(400, "Product ID is required.");
    }

    // Verify JWT and extract user ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    const cart = await Cart.findOne({ customerId: _id });
    if (!cart) {
      return error(404, "Cart not found.");
    }

    const productIndex = cart.products.findIndex(
      (p: CartProduct) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return error(404, "Product not found in cart.");
    }

    // Remove product from cart
    cart.products.splice(productIndex, 1);

    await cart.save();

    return success(200, "Product removed from cart.");
  } catch (e) {
    console.error(e);
    return error(500, "Something went wrong.");
  }
}
