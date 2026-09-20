import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import informationReducer from "./slice/informationSlice";
import wishlistReducer from "./slice/wishlistSlice";

const informationPersistConfig = {
  key: "information",
  storage,
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};

const persistedInformationReducer = persistReducer(
  informationPersistConfig,
  informationReducer
);

const persistedWishlistReducer = persistReducer(
  wishlistPersistConfig,
  wishlistReducer
);

export const store = configureStore({
  reducer: {
    information: persistedInformationReducer,
    wishlist: persistedWishlistReducer,
  },
});

export const persistor = persistStore(store);