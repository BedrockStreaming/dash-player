import { eventBus } from './components/eventBus';
import { MANIFEST_LOADED } from './constants/events';

import { Manifest } from './model/manifest';

export class Player {
  constructor(videoRef) {
    this.videoRef = videoRef;
  }

  load(url) {
    console.debug(`Loading source ${url}`);

    fetch(url)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then(xml => {
        console.log(xml);

        const manifest = Manifest.createFrom(xml);

        eventBus.triggerEvent({ type: MANIFEST_LOADED, manifest });

        console.log(manifest);
      });
  }

  addEventListener = eventBus.addEventListener;
  removeEventListener = eventBus.removeEventListener;
}
