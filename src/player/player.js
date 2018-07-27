export class Player {
  constructor(videoRef) {
    this.videoRef = videoRef;
  }

  load(url) {
    console.debug(`Loading source ${url}`);

    fetch(url)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then(xml => console.log(xml));
  }
}
