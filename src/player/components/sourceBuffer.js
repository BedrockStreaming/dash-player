export class SourceBuffer {
  constructor(mediaSource, codec) {
    this.queue = [];

    this.buffer = mediaSource.addSourceBuffer(codec);
    this.buffer.addEventListener('updateend', this.onSourceBufferUpdateEnd);
  }

  append(segment) {
    if (this.buffer.updating) {
      this.queue.push(segment);
    } else {
      this.buffer.appendBuffer(segment.bytes);
    }
  }

  onSourceBufferUpdateEnd = () => {
    if (this.queue.length) {
      const segment = this.queue.pop();
      this.buffer.appendBuffer(segment.bytes);
    }
  };
}
