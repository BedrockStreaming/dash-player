import { SourceBuffer } from './sourceBuffer';

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
      this.fragmentManager.initFragments(adaptationSet, this.appendBuffer(type));
    });
  };

  createBuffer(type) {
    const adaptationSet = this.currentPeriod.findAdaptationSetByType(type);
    const codec = adaptationSet.mimeType();
    const buffer = this.mediaSource.addSourceBuffer(codec);

    return new SourceBuffer(buffer);
  }

  appendBuffer = type => bytes => this.buffers[type].append({ bytes });
}
