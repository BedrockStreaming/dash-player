import { Period } from './period';

const BASE_URL = './';
export class Manifest {
  static createFrom(htmlNode) {
    const xmlBaseUrl = htmlNode.getElementsByTagName('BaseUrl')[0];

    return new Manifest(
      xmlBaseUrl ? xmlBaseUrl.textContent : BASE_URL,
      Array.from(htmlNode.getElementsByTagName('Period')).map(Period.createFrom),
    );
  }

  constructor(baseUrl, periods) {
    this.periods = periods;
    this.baseUrl = baseUrl;
  }
}