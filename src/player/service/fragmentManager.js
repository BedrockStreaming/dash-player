export class FragmentManager {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  fetchInitFragment(adaptationSet, callback) {
    const initialization = adaptationSet.readableInitializer();

    return this.fetchFragment(this.baseUrl + initialization, callback);
  }

  fetchNextFragment(adaptationSet, start, callback) {
    const media = adaptationSet.readableMedia(start);

    return this.fetchFragment(this.baseUrl + media, callback);
  }

  fetchFragment(url, callback) {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(callback);
  }
}
