export const HANDLE_PLAYER_EVENT = 'HANDLE_PLAYER_EVENT';
export const HANDLE_SOURCE_CHANGE = 'HANDLE_SOURCE_CHANGE';

export const handlePlayerEvent = event => ({ type: HANDLE_PLAYER_EVENT, event });
export const handleSourceChange = source => ({ type: HANDLE_SOURCE_CHANGE, source });
