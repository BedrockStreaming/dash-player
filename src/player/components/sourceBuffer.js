export class SourceBuffer {
  constructor(buffer) {
    this.queue = [];

    this.buffer = buffer;
    this.buffer.addEventListener('updateend', this.onSourceBufferUpdateEnd);
  }

  append(segment) {
    if (this.buffer.updating) {
      return this.queue.push({ type: 'append', segment });
    }

    return this.buffer.appendBuffer(segment.bytes);
  }

  remove(start, end) {
    if (this.buffer.updating) {
      return this.queue.push({ type: 'remove', start, end });
    }

    return this.buffer.remove(start, end);
  }

  onSourceBufferUpdateEnd = () => {
    if (this.queue.length && !this.buffer.updating) {
      const queueItem = this.queue.pop();

      if (queueItem.type === 'append') {
        const {
          segment: { bytes },
        } = queueItem;

        this.buffer.appendBuffer(bytes);
      } else if (queueItem.type === 'remove') {
        const { start, end } = queueItem;
        this.buffer.remove(start, end);
      }
    }
  };

  getBufferedRange() {
    const { buffered } = this.buffer;

    if (buffered.length) {
      return { start: buffered.start(0), end: buffered.end(0) };
    }

    return { start: 0, end: 0 };
  }
}
