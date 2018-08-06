import { createStore } from 'redux';
import { combinedReducers } from './reducers';

export const initStore = () => createStore(combinedReducers);
export const store = initStore();
