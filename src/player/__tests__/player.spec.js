import { Player } from '../player';

jest.unmock('../player');

describe('player.js', () => {
  beforeEach(() => {
    window.fetch = jest.fn(() =>
      Promise.resolve({
        text: jest.fn(() => '<MPD />'),
      }),
    );
  });

  it('should load a manifest and parse the xml out of it', () => {
    const player = new Player({});
    player.load('//dash.com/manifest.mpd');

    expect(window.fetch).toBeCalledWith('//dash.com/manifest.mpd');
  });
});
