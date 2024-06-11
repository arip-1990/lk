import { combineReducers } from "redux";
import { crumbReducer } from "./crumbReducer";
import { configureStore } from "@reduxjs/toolkit";
import { categoryApi } from "../services/CategoryService";
import { storeApi } from "../services/StoreService";
import { providerApi } from "../services/ProviderService";
import { testApi } from "../services/TestService";
import { workerApi } from "../services/WorkerService";
import { mediaApi } from "../services/MediaService";
import { claimApi } from "../services/ClaimService";
import { trainingApi } from "../services/TrainingService";
import { statementApi } from "../services/StatementService";
import { contactApi } from "../services/ContactService";
import { userApi } from "../services/UserService";
import { dateReducer } from "./dateReducer";
import { timeCardApi } from "../services/TimeCardService";
import { inventoryApi } from  "../services/InventoryService";

const rootReducer = combineReducers({
  [categoryApi.reducerPath]: categoryApi.reducer,
  [storeApi.reducerPath]: storeApi.reducer,
  [providerApi.reducerPath]: providerApi.reducer,
  [testApi.reducerPath]: testApi.reducer,
  [workerApi.reducerPath]: workerApi.reducer,
  [mediaApi.reducerPath]: mediaApi.reducer,
  [claimApi.reducerPath]: claimApi.reducer,
  [trainingApi.reducerPath]: trainingApi.reducer,
  [statementApi.reducerPath]: statementApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [timeCardApi.reducerPath]: timeCardApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  crumbs: crumbReducer,
  date: dateReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(categoryApi.middleware)
      .concat(storeApi.middleware)
      .concat(providerApi.middleware)
      .concat(testApi.middleware)
      .concat(workerApi.middleware)
      .concat(mediaApi.middleware)
      .concat(claimApi.middleware)
      .concat(trainingApi.middleware)
      .concat(statementApi.middleware)
      .concat(contactApi.middleware)
      .concat(userApi.middleware)
      .concat(timeCardApi.middleware)
      .concat(inventoryApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
