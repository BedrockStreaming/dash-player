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
}
