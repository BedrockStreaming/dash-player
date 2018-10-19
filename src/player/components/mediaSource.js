import { SourceBuffer } from './sourceBuffer';
import { logger } from '../service/logger';

export class MediaSource {
  constructor(period, tracks, fragmentManager) {
    this.mediaSource = new window.MediaSource();
    this.tracks = tracks;
    this.queue = [];
    this.buffers = {};
    this.fragmentManager = fragmentManager;
    this.currentPeriod = period;

    this.mediaSource.addEventListener('sourceopen', this.onSourceOpen);
  }

  mediaUrl = () => URL.createObjectURL(this.mediaSource);

  setCurrentPeriod = period => {
    this.currentPeriod = period;
  };

  onSourceOpen = () => {
    this.buffers = this.tracks.reduce((acc, type) => ({ ...acc, [type]: this.createBuffer(type) }), {});

    this.tracks.forEach(type => {
      const adaptationSet = this.currentPeriod.findAdaptationSetByType(type);
      this.fragmentManager.fetchInitFragment(adaptationSet, this.appendBuffer(type));
    });

    setInterval(this.schedule, 1000);
  };

  createBuffer(type) {
    const adaptationSet = this.currentPeriod.findAdaptationSetByType(type);
    const codec = adaptationSet.mimeType();
    const buffer = this.mediaSource.addSourceBuffer(codec);

    return new SourceBuffer(buffer);
  }

  appendBuffer = type => bytes => this.buffers[type].append({ bytes });

  schedule = () => {
    const bufferToAchieve = 15;
    const bufferToPruneBehind = 15;

    const { currentTime } = document.querySelector('video');

    this.tracks.forEach(type => {
      const buffer = this.buffers[type];
      const { start, end } = buffer.getBufferedRange();

      const adaptationSet = this.currentPeriod.findAdaptationSetByType(type);

      // Load new buffer data
      if (end - currentTime < bufferToAchieve) {
        const startTime = end - currentTime < 0 ? currentTime : end;
        this.fragmentManager.fetchNextFragment(adaptationSet, startTime, this.appendBuffer(type));
      }

      // The user has seeked ahead or behing the buffered range
      if (currentTime < start || currentTime > end) {
        buffer.remove(start, end);

        this.fragmentManager.fetchNextFragment(adaptationSet, currentTime - 3, this.appendBuffer(type));
      }

      // Buffer to prune behind
      if (currentTime - start > bufferToPruneBehind) {
        const pruningEnd = Math.min(currentTime - bufferToPruneBehind, end);

        logger.log(`Going to remove some buffer (from ${start} to ${pruningEnd})`);
        buffer.remove(start, pruningEnd);
      }
    });
  };
}
