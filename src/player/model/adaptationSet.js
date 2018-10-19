import { Representation } from './representation';

export class AdaptationSet {
  static createFrom(htmlNode) {
    return new AdaptationSet(
      Array.from(htmlNode.getElementsByTagName('Representation')).map(Representation.createFrom),
      Array.from(htmlNode.getElementsByTagName('SegmentTemplate')[0].attributes)
        .map(attribute => ({ [attribute.nodeName]: attribute.nodeValue }))
        .reduce((_, attribute) => ({ ..._, ...attribute }), {}),
      Array.from(htmlNode.attributes)
        .map(attribute => ({ [attribute.nodeName]: attribute.nodeValue }))
        .reduce((_, attribute) => ({ ..._, ...attribute }), {}),
    );
  }

  constructor(representations, segmentTemplate, attributes) {
    this.representations = representations;
    this.attributes = attributes;
    this.segmentTemplate = segmentTemplate;
  }

  mimeType() {
    const { codecs } = this.representations[0].attributes;

    return `${this.attributes.mimeType}; codecs="${codecs}"`;
  }

  countSegment() {
    return Math.round(30 / (this.segmentTemplate.duration / 1000));
  }

  makeReadable(field) {
    const { id } = this.representations[0].attributes;

    return this.segmentTemplate[field].replace(/\$RepresentationID\$/g, id);
  }

  readableMedia(startTime) {
    const previousSegments = Math.round(startTime * 1000 / this.segmentTemplate.duration);

    return this.makeReadable('media').replace(
      '$Number$',
      Math.max(this.segmentTemplate.startNumber, previousSegments + 1),
    );
  }

  readableInitializer() {
    return this.makeReadable('initialization');
  }
}
