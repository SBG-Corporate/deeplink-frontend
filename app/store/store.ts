import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { userSlice } from "./slices/user/userSlice";
import { messagesSlice } from "./slices/messages/messagesSlice";


const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, userSlice.reducer);
const rootReducer = combineReducers({
  persisted: persistedReducer,
  messagesSlice: messagesSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof rootReducer>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;