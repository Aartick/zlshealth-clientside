# Coupon System Documentation

## Overview
A complete coupon validation and management system for the ZLS Health e-commerce cart.

## Features

### ✅ Implemented Features
1. **Dynamic Coupon Loading**: Fetches available coupons from MongoDB database
2. **Real-time Validation**: Validates coupon codes against cart total
3. **Smart UI Indicators**:
   - Shows which coupons are applicable based on cart value
   - Displays how much more to add for inapplicable coupons
   - Highlights applied coupons with green theme
4. **One-click Apply**: Apply/remove coupons directly from coupon cards
5. **Manual Entry**: Type and apply coupon codes manually
6. **View All/Show Less**: Collapsible coupon list for better UX
7. **Order Summary Integration**: Applied discount reflects in total amount

## Database Model

### Coupon Schema
```typescript
{
  code: string;                // Unique coupon code (uppercase)
  discountPercentage: number;  // Discount percentage (e.g., 10 for 10%)
  maxDiscountAmount: number;   // Maximum discount cap in ₹
  minOrderAmount: number;      // Minimum order required in ₹
  createdAt: Date;            // Auto-generated
  updatedAt: Date;            // Auto-generated
}
```

## API Endpoints

### 1. GET `/api/coupons`
Fetches all available coupons from the database.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "code": "HEALTH200",
      "discountAmount": 200,
      "maxDiscountAmount": 200,
      "minOrderAmount": 1500,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "count": 5
}
```

### 2. POST `/api/validateCoupon`
Validates a coupon code against the current cart total.

**Request:**
```json
{
  "code": "HEALTH200",
  "cartTotal": 2000
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "code": "HEALTH200",
    "discountAmount": 200,
    "maxDiscountAmount": 200,
    "minOrderAmount": 1500
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid coupon code"
}
```

## Sample Coupons

The following test coupons are available in the database:

| Code | Discount | Max Discount | Min Order | Description |
|------|----------|--------------|-----------|-------------|
| `SAVE25` | 25% | ₹500 | ₹2000 | 25% off (max ₹500) on orders above ₹2000 |
| `WELLNESS20` | 20% | ₹300 | ₹800 | 20% off (max ₹300) on orders above ₹800 |
| `FIRSTBUY` | 15% | ₹150 | ₹1000 | 15% off (max ₹150) on orders above ₹1000 |
| `HEALTH10` | 10% | ₹200 | ₹1500 | 10% off (max ₹200) on orders above ₹1500 |
| `FREESHIP` | 5% | ₹50 | ₹499 | 5% off (max ₹50) on orders above ₹499 |

## Adding New Coupons

### Method 1: Using the Seed Script
Run the seed script to add sample coupons:
```bash
npx tsx scripts/seedCoupons.ts
```

### Method 2: Direct Database Insert
Insert coupons directly into MongoDB:
```javascript
db.coupons.insertOne({
  code: "NEWCODE",
  discountPercentage: 10,  // 10% discount
  maxDiscountAmount: 100,  // Maximum ₹100 discount
  minOrderAmount: 500,     // Minimum order ₹500
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 3: API Endpoint (Future Enhancement)
Create an admin API endpoint to add/manage coupons through the UI.

## Cart Integration

### Price Calculation
```typescript
// Base calculation
const totalPrice = cart.reduce((acc, item) =>
  acc + item.price * item.quantity, 0
);

const discountedTotalPrice = cart.reduce((acc, item) =>
  acc + (item.price - (item.price * item.discount / 100)) * item.quantity, 0
);

const packagingPrice = 20;
const baseTotal = discountedTotalPrice + packagingPrice;

// After coupon application
const paymentAmount = Math.max(0, baseTotal - couponDiscount);
```

### Coupon Application Logic
1. User enters or selects a coupon
2. Frontend validates cart is not empty
3. API validates coupon code exists
4. API checks minimum order requirement
5. Calculate discount (min of discountAmount, maxDiscountAmount, baseTotal)
6. Apply discount to payment amount
7. Show success message with saved amount

## UI Components

### Coupon Input Section
- Manual text input for coupon codes
- Apply/Remove button
- Loading state during validation
- Applied coupon indicator

### Coupon Cards
- Dynamic list from database
- Checkbox for selection
- Apply/Remove button
- Eligibility indicator
- Min order requirement display
- Applied status badge

### Order Summary
- Shows coupon discount as separate line item
- Updates total amount dynamically
- Displays saved amount

## Testing

### Test Scenario 1: Apply Valid Coupon
1. Add items worth ₹1500+ to cart
2. Enter "HEALTH200" in coupon input
3. Click "Apply"
4. ✅ Should show success message
5. ✅ Should reduce total by ₹200

### Test Scenario 2: Insufficient Cart Value
1. Add items worth ₹500 to cart
2. Try to apply "HEALTH200"
3. ❌ Should show error: "Minimum order amount for this coupon is ₹1500"

### Test Scenario 3: Invalid Coupon
1. Enter "INVALID123"
2. Click "Apply"
3. ❌ Should show error: "Invalid coupon code"

### Test Scenario 4: Quick Apply from Card
1. View coupon cards
2. Click "Apply" on an eligible coupon
3. ✅ Should apply immediately
4. ✅ Card should highlight in green

## Files Modified/Created

### Created Files
- `app/api/coupons/route.ts` - Fetch coupons API
- `app/api/validateCoupon/route.ts` - Validate coupon API
- `models/Coupon.ts` - Coupon database model
- `scripts/seedCoupons.ts` - Seed script for test data

### Modified Files
- `app/(pages)/cart/page.tsx` - Cart page with coupon UI

## Future Enhancements

1. **Coupon Expiry**: Add expiry dates for coupons
2. **Usage Limits**: Limit number of times a coupon can be used
3. **User-specific Coupons**: Tie coupons to specific user accounts
4. **Percentage Discounts**: Support percentage-based discounts
5. **Bulk Coupons**: Generate multiple unique coupon codes
6. **Admin Dashboard**: Create/edit/delete coupons from admin panel
7. **Analytics**: Track coupon usage statistics
8. **Auto-apply Best Coupon**: Suggest best available coupon

## Troubleshooting

### Issue: 404 Error when applying coupon
**Solution**: Restart your Next.js development server
```bash
# Stop the server (Ctrl+C)
# Restart
npm run dev
```

### Issue: No coupons showing in UI
**Solution**: Run the seed script to add sample coupons
```bash
npx tsx scripts/seedCoupons.ts
```

### Issue: Coupon validation fails
**Solution**: Check MongoDB connection and verify coupons exist
```bash
# Check database connection in logs
# Verify .env.local has MONGOURI
```

## Support

For issues or questions:
1. Check the console logs for errors
2. Verify MongoDB connection
3. Ensure dev server is running
4. Check Network tab in browser DevTools
