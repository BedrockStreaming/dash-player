import { SourceBuffer } from './sourceBuffer';

export class MediaSource {
  constructor() {
    this.queue = [];
    this.buffers = {};
  }

  getObjectURL = () => URL.createObjectURL(this.mediaSource);

  loadManifest = (manifest, type) => {
    this.manifest = manifest;
    this.type = type;

    this.mediaSource = new window.MediaSource();
    this.mediaSource.addEventListener('sourceopen', this.onSourceOpen);
  };

  onSourceOpen = () => {
    this.buffers = ['video', 'audio'].reduce((acc, type) => ({ ...acc, [type]: this.createBuffer(type) }), {});

    ['video', 'audio'].forEach(type => this.fetchFragmentsFor(type));
  };

  createBuffer(type) {
    const { manifest, mediaSource } = this;
    const {
      representations: [
        {
          attributes: { codecs },
        },
      ],
      attributes: { mimeType },
    } = manifest.getCurrentPeriod().getAdaptationSetFor(type);

    const codec = `${mimeType}; codecs="${codecs}"`;

    console.debug(type, 'loading codec', codec);

    return new SourceBuffer(mediaSource, codec);
  }

  fetchFragmentsFor(type) {
    const { manifest } = this;
    const {
      segmentTemplate: { initialization, duration },
      representations: [
        {
          attributes: { id },
        },
      ],
    } = manifest.getCurrentPeriod().getAdaptationSetFor(type);

    const initFragment =
      manifest.url.substring(0, manifest.url.lastIndexOf('/') + 1) +
      manifest.baseUrl +
      initialization.replace(/\$RepresentationID\$/g, id);

    this.fetchFragment(type, initFragment).then(() => {
      const segments = Math.round(30 / (duration / 1000));

      let promise = Promise.resolve();

      for (let fragmentNumber = 1; fragmentNumber <= segments; fragmentNumber++) {
        promise = promise.then(() => this.fetchFragment(type, this.getFragmentUrl(type, fragmentNumber)));
      }
    });
  }

  getFragmentUrl = (type, number) => {
    const { manifest } = this;
    const {
      segmentTemplate: { media },
      representations: [
        {
          attributes: { id },
        },
      ],
    } = manifest.getCurrentPeriod().getAdaptationSetFor(type);

    return (
      manifest.url.substring(0, manifest.url.lastIndexOf('/') + 1) +
      manifest.baseUrl +
      media.replace(/\$RepresentationID\$/g, id).replace('$Number$', number)
    );
  };

  fetchFragment(type, url) {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => {
        this.buffers[type].append({ bytes: data });

        return data;
      });
  }
}
