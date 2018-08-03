export class FragmentManager {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  initFragments = (adaptationSet, callback) => {
    const initialization = adaptationSet.readableInitializer();
    const initFragmentUrl = this.baseUrl + initialization;

    this.fetchFragment(initFragmentUrl, callback).then(() => this.fetchFragments(adaptationSet, callback));
  };

  fetchFragments(adaptationSet, callback) {
    const segmentsCounts = adaptationSet.countSegment();

    let promise = Promise.resolve();

    for (let fragmentNumber = 1; fragmentNumber <= segmentsCounts; fragmentNumber++) {
      const media = adaptationSet.readableMedia(fragmentNumber);
      promise = promise.then(() => this.fetchFragment(this.baseUrl + media, callback));
    }

    return promise;
  }

  fetchFragment(url, callback) {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(callback);
  }
}
