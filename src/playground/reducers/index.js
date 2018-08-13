import { HANDLE_PLAYER_EVENT, HANDLE_SOURCE_CHANGE } from '../actions';

const DEFAULT_SOURCE = 'http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd';

export const initialState = {
  events: [],
  source: DEFAULT_SOURCE,
};

export const playgroundReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case HANDLE_PLAYER_EVENT:
      return { ...state, events: [...state.events, action.event] };

    case HANDLE_SOURCE_CHANGE:
      return { ...state, source: action.source, events: [] };

    default:
      return state;
  }
};
