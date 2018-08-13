import { combineReducers } from 'redux';
import { playgroundReducer } from '../reducers';

export const combinedReducers = combineReducers({ playground: playgroundReducer });
