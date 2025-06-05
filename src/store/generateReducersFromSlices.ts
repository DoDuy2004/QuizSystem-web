import {
  combineReducers,
  type Reducer,
  type ReducersMapObject,
  type UnknownAction,
} from '@reduxjs/toolkit';
import type { SlicesType } from './withSlices';

type ReducerGroup = Reducer<any, UnknownAction> | ReducersMapObject<any>;

export const generateReducersFromSlices = (slices: SlicesType): ReducersMapObject => {
  const reducerGroups: Record<string, ReducerGroup> = {};

  slices?.forEach((slice) => {
    const [primary, secondary] = slice.name.split('/');

    if (secondary) {
      if (!reducerGroups[primary]) {
        reducerGroups[primary] = {};
      }

      (reducerGroups[primary] as ReducersMapObject)[secondary] = slice.reducer;
    } else {
      reducerGroups[primary] = slice.reducer;
    }
  });

  const combinedReducers: ReducersMapObject = {};

  Object.entries(reducerGroups).forEach(([key, reducerGroup]) => {
    if (typeof reducerGroup === 'function') {
      combinedReducers[key] = reducerGroup;
    } else {
      combinedReducers[key] = combineReducers(reducerGroup as ReducersMapObject);
    }
  });

  return combinedReducers;
};

export default generateReducersFromSlices;
