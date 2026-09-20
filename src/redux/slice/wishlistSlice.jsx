import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.favorites.some(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.favorites.push(action.payload);
      }
    },

    removeFromWishlist: (state, action) => {
      state.favorites = state.favorites.filter(
        (item) => item.id !== action.payload
      );
    },

    toggleWishlist: (state, action) => {
      const exists = state.favorites.some(
        (item) => item.id === action.payload.id
      );

      if (exists) {
        state.favorites = state.favorites.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        state.favorites.push(action.payload);
      }
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;