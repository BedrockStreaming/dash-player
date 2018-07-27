export class Representation {
  static createFrom(htmlNode) {
    return new Representation(
      Array.from(htmlNode.attributes)
        .map(attribute => ({ [attribute.nodeName]: attribute.nodeValue }))
        .reduce((_, attribute) => ({ ..._, ...attribute }), {}),
    );
  }

  constructor(attributes) {
    this.attributes = attributes;
  }
}
