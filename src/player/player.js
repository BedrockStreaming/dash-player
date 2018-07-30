import { eventBus } from './components/eventBus';
import { MediaSource } from './components/mediaSource';

import { MANIFEST_LOADED } from './constants/events';

import { Manifest } from './model/manifest';
import { FragmentManager } from '../player/service/fragmentManager';

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
        const manifest = Manifest.createFrom(xml);

        manifest.url = url;

        const fm = new FragmentManager(manifest.generateUrl());
        const wMediaSource = new window.MediaSource();

        eventBus.triggerEvent({ type: MANIFEST_LOADED, manifest });

        const mediaSource = new MediaSource(manifest.getCurrentPeriod(), wMediaSource, ['video', 'audio'], fm);

        this.videoRef.src = URL.createObjectURL(wMediaSource);
      });
  }

  addEventListener = eventBus.addEventListener;
  removeEventListener = eventBus.removeEventListener;
}
