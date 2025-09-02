import Order from "@/models/Order";
import { verifyAccessToken } from "@/utils/authMiddleware";
import { error, success } from "@/utils/responseWrapper";
import { NextRequest } from "next/server";

/**
 * @route GET /api/orders/{id}
 * @description - Fetch a single order by its ID for the authenticated customer.
 * 1. Verifies JWT access token from request headers.
 * 2. Finds the order by ID and ensures it belongs to the authenticated customer.
 * 3. Populates product details (name, price, imageUrl, sku, brand).
 * 4. Returns the order if found, otherwise returns an error response.
 * @param {NextRequest} req - The incoming Next.js request object 
 * @param {Object} params - Route parameters
 * @param {string} params.id - The ID of the order to fetch 
 * @returns - JSON response containing order data or error message
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify JWT token and extract customer ID
    const { valid, response, _id } = await verifyAccessToken(req);
    if (!valid) return response!;

    // Find the order by ID for the authenticated customer
    const order = await Order.findOne({
      _id: params.id,
      customerId: _id,
    }).populate({
      path: "products.productId",
      select: "name price imageUrl sku brand",
    });

    // If no order is found
    if (!order) {
      return error(404, "Order not found");
    }

    // Success: return order details
    return success(200, order);
  } catch (e) {
    console.log(e);
    return error(500, "Something went wrong");
  }
}
