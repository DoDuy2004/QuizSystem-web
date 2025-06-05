import { combineSlices } from "@reduxjs/toolkit";
// import apiService from "./apiService";
// import { userSlice } from "./slices/userSlice";

// @ts-ignore-next-line
export interface LazyLoadedSlices {}

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer =
  combineSlices().withLazyLoadedSlices<LazyLoadedSlices>();
  /**
   * Static slices
   */
  // userSlice,
  /**
   * Lazy loaded slices
   */
  // {
  //   [apiService.reducerPath]: apiService.reducer,
  // }

export default rootReducer;
