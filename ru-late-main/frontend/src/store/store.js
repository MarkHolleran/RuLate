import storage from 'redux-persist/lib/storage';
import tokenReducer from './tokenSlice';
import userReducer from './userSlice';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Configuration for persistent store
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers from all slices
const reducers = combineReducers({
  token: tokenReducer,
  user: userReducer
});

// Create persistent reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Create store
export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }
    }),
  devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});