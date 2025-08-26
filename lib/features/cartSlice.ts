import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addToCart, removeFromCart } from "../thunks/cartThunks";

interface CartItemType {
  _id: string;
  name: string;
  img: string | undefined;
  price: number;
  quantity: number;
}

interface GroceryCartState {
  cart: CartItemType[];
}

const initialState: GroceryCartState = {
  cart: [],
};

const groceryCartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCartGuest: (state, action: PayloadAction<CartItemType>) => {
      const curProduct = action.payload;
      const index = state.cart.findIndex((item) => item._id === curProduct._id);

      if (index === -1) {
        state.cart.push({ ...curProduct });
      } else {
        state.cart[index].quantity += 1;
      }
    },
    removeFromCartGuest: (state, action: PayloadAction<string>) => {
      const index = state.cart.findIndex((item) => item._id === action.payload);

      if (index === -1) return;

      if (state.cart[index].quantity === 1) {
        state.cart = state.cart.filter((item) => item._id !== action.payload);
      } else {
        state.cart[index].quantity -= 1;
      }
    },
    resetCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.cart = action.payload;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.cart = action.payload;
    });
  },
});

export default groceryCartSlice.reducer;

export const { addToCartGuest, removeFromCartGuest, resetCart } =
  groceryCartSlice.actions;
