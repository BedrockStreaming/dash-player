import { SourceBuffer } from '../sourceBuffer';

jest.unmock('../sourceBuffer');

describe('sourceBuffer.js', () => {
  let buffer;
  let sourceBuffer;

  beforeEach(() => {
    buffer = { addEventListener: jest.fn(), appendBuffer: jest.fn() };
    sourceBuffer = new SourceBuffer(buffer);
  });

  describe('constructor', () => {
    it('should have created a valid source buffer with a listener on updateend', () => {
      expect(sourceBuffer.queue).toEqual([]);
      expect(sourceBuffer.buffer).toEqual(buffer);
      expect(buffer.addEventListener).toHaveBeenCalledWith('updateend', sourceBuffer.onSourceBufferUpdateEnd);
    });
  });

  describe('append', () => {
    it('should have populate the queue when the buffer is busy updating', () => {
      sourceBuffer.buffer.updating = true;
      const waitingSegment = { bytes: [] };

      expect(sourceBuffer.queue).toEqual([]);

      sourceBuffer.append(waitingSegment);

      expect(sourceBuffer.queue).toEqual([waitingSegment]);
    });

    it("should have append the segment to the buffer when it's not busy", () => {
      const waitingSegment = { bytes: [] };

      sourceBuffer.append(waitingSegment);

      expect(buffer.appendBuffer).toHaveBeenCalledWith(waitingSegment.bytes);
    });
  });

  describe('onSourceBufferUpdateEnd', () => {
    it('should append a segment when the queue is not empty and the buffer is ready', () => {
      sourceBuffer.queue = [{ bytes: [1] }, { bytes: [2] }];

      sourceBuffer.onSourceBufferUpdateEnd();

      expect(buffer.appendBuffer).toHaveBeenCalledWith([2]);
    });

    it('shouldnt have append a segment when the queue is empty and the buffer is ready', () => {
      sourceBuffer.queue = [];

      sourceBuffer.onSourceBufferUpdateEnd();

      expect(buffer.appendBuffer).not.toHaveBeenCalled();
    });
  });
});
