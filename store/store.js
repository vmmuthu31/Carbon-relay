import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "./userReducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  // Optionally, add a timeout for the persisted state
  // This will expire the state after 2 hours (7200000 milliseconds)
  stateReconciler: (inboundState, originalState, reducedState) => {
    const persistedState = { ...reducedState, ...inboundState };
    const now = new Date().getTime();
    const lastUpdated = persistedState._lastUpdated || now;
    const isExpired = now - lastUpdated > 7200000;

    if (isExpired) {
      return originalState;
    }

    return { ...persistedState, _lastUpdated: now };
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
