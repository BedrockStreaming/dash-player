import { SourceBuffer } from './sourceBuffer';

export class MediaSource {
  constructor(period, windowMediaSource, tracks, fm) {
    this.mediaSource = windowMediaSource;
    this.tracks = tracks;
    this.queue = [];
    this.buffers = {};
    this.fm = fm;
    this.currentPeriod = period;

    this.mediaSource.addEventListener('sourceopen', this.onSourceOpen);
  }

  setCurrentPeriod = period => {
    this.currentPeriod = period;
  };

  onSourceOpen = () => {
    this.buffers = this.tracks.reduce((acc, type) => ({ ...acc, [type]: this.createBuffer(type) }), {});

    this.tracks.forEach(type => {
      const adaptationSet = this.currentPeriod.findAdaptationSetByType(type);
      this.fm.initFragments(adaptationSet, this.increaseBuffer(type));
    });
  };

  createBuffer(type) {
    const adaptationSet = this.currentPeriod.findAdaptationSetByType(type);
    const codec = adaptationSet.mimeType();
    const buffer = this.mediaSource.addSourceBuffer(codec);

    return new SourceBuffer(buffer);
  }

  increaseBuffer = type => bytes => this.buffers[type].append({ bytes });
}
