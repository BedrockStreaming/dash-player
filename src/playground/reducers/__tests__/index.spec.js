import deepFreeze from 'deep-freeze';
import { playgroundReducer } from '../../reducers';

import { HANDLE_PLAYER_EVENT, HANDLE_SOURCE_CHANGE } from '../../actions';

jest.unmock('../../reducers');

function freezedReducer(state, action) {
  return playgroundReducer(deepFreeze(state), action);
}

describe('playgroundReducer', () => {
  const initialState = {
    events: [],
    source: 'http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd',
  };

  it('should HANDLE_PLAYER_EVENT', () => {
    const action = { type: HANDLE_PLAYER_EVENT, event: {} };

    expect(freezedReducer(initialState, action)).toMatchSnapshot();
  });

  it('should SEARCH_VI', () => {
    const action = { type: HANDLE_SOURCE_CHANGE, source: 'source' };

    expect(freezedReducer(initialState, action)).toMatchSnapshot();
  });
});
