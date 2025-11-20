import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "@/redux/authSlice.js";
import jobSlice from "@/redux/jobSlice.js";
import categorySlice from "@/redux/categorySlice.js";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

import companySlice from "@/redux/companySlice.js";
import applicationSlice from "@/redux/applicationSlice.js";
import cvSlice from "@/redux/cvSlice.js";
import careerGuideSlice from "@/redux/careerGuideSlice.js";
import notificationSlice from "@/redux/notificationSlice.js";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["auth", "cv", "application"],
};
const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice,
  company: companySlice,
  application: applicationSlice,
  category: categorySlice,
  cv: cvSlice,
  careerGuide: careerGuideSlice,
  notification: notificationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // Tăng performance
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
