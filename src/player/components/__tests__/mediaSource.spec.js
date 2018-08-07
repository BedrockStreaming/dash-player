import { MediaSource } from '../mediaSource';
import { SourceBuffer } from '../sourceBuffer';

jest.unmock('../mediaSource');

describe('MediaSource', () => {
  let period;
  let tracks;
  let fragmentManager;
  let mediaSource;
  let addEventListener;
  let addSourceBuffer;

  beforeEach(() => {
    addEventListener = jest.fn();
    addSourceBuffer = jest.fn(codec => `${codec} - source buffer`);

    /* This is why dependency injection matters... */
    window.MediaSource = class {
      addEventListener = addEventListener;
      addSourceBuffer = addSourceBuffer;
    };

    window.URL = { createObjectURL: jest.fn(() => 42) };

    period = { findAdaptationSetByType: jest.fn(() => ({ mimeType: () => 'video' })) };
    tracks = ['video', 'audio'];
    fragmentManager = { initFragments: jest.fn((set, fn) => fn([])) };

    mediaSource = new MediaSource(period, tracks, fragmentManager);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('should create a MediaSource with valid mediasource, period, tracks, queue, buffer, fragmentManager and currentPeriod', () => {
      expect(mediaSource.mediaSource).toEqual(new window.MediaSource());
      expect(mediaSource.tracks).toEqual(tracks);
      expect(mediaSource.queue).toEqual([]);
      expect(mediaSource.fragmentManager).toEqual(fragmentManager);
      expect(mediaSource.currentPeriod).toEqual(period);
      expect(addEventListener).toHaveBeenCalledWith('sourceopen', mediaSource.onSourceOpen);
    });
  });

  describe('mediaUrl', () => {
    it('should have created a valid object url and called the URL associated method', () => {
      const mediaUrl = mediaSource.mediaUrl();

      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mediaSource.mediaSource);
      expect(mediaUrl).toBe(42);
    });
  });

  describe('setCurrentPeriod', () => {
    it('should have changed the current period', () => {
      const newPeriod = { findAdaptationSetByType: jest.fn(), someOtherProps: null };
      expect(mediaSource.currentPeriod).not.toEqual(newPeriod);

      mediaSource.setCurrentPeriod(newPeriod);

      expect(mediaSource.currentPeriod).toEqual(newPeriod);
    });
  });

  describe('createBuffer', () => {
    it('should have created a source buffer', () => {
      SourceBuffer.mockImplementation(type => ({
        key: type,
      }));

      const sourceBuffer = mediaSource.createBuffer('video');
      const expectedSourceBuffer = new SourceBuffer('video - source buffer');

      expect(sourceBuffer).toEqual(expectedSourceBuffer);
    });
  });

  describe('appendBuffer', () => {
    it('should have appended some data to the buffer array', () => {
      mediaSource.buffers.video = { append: jest.fn() };

      mediaSource.appendBuffer('video')(['a', 'b']);

      expect(mediaSource.buffers.video.append).toHaveBeenCalledWith({ bytes: ['a', 'b'] });
    });
  });
});
