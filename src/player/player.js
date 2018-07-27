import { eventBus } from './components/eventBus';
import { MediaSource } from './components/mediaSource';

import { MANIFEST_LOADED } from './constants/events';

import { Manifest } from './model/manifest';

export class Player {
  constructor(videoRef) {
    this.videoRef = videoRef;
    this.queue = [];
  }

  load(url) {
    fetch(url)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then(xml => {
        console.log(xml);

        const manifest = Manifest.createFrom(xml);
        manifest.url = url;

        eventBus.triggerEvent({ type: MANIFEST_LOADED, manifest });

        const mediaSource = new MediaSource(this.videoRef, manifest);
        mediaSource.loadManifest(manifest);

        this.videoRef.src = mediaSource.getObjectURL();
      });
  }

  addEventListener = eventBus.addEventListener;
  removeEventListener = eventBus.removeEventListener;
}
