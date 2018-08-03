export class SourceBuffer {
  constructor(buffer) {
    this.queue = [];

    this.buffer = buffer;
    this.buffer.addEventListener('updateend', this.onSourceBufferUpdateEnd);
  }

  append(segment) {
    if (this.buffer.updating) {
      return this.queue.push(segment);
    }

    return this.buffer.appendBuffer(segment.bytes);
  }

  onSourceBufferUpdateEnd = () => {
    if (this.queue.length) {
      const segment = this.queue.pop();

      this.buffer.appendBuffer(segment.bytes);
    }
  };
}
