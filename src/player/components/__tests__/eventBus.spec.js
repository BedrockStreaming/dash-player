import { eventBus } from '../eventBus';
import { logger } from '../../service/logger';

jest.mock('../../service/logger', () => ({
  logger: { warn: jest.fn() },
}));

jest.unmock('../eventBus');

describe('eventBus.js', () => {
  let eventName;
  let firstListener;
  let secondListener;

  beforeEach(() => {
    eventBus.listeners = {
      ALL: [],
    };

    firstListener = jest.fn();
    secondListener = jest.fn();
    eventName = 'james';

    global.Date.now = jest.fn(() => 42000);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('addEventListener', () => {
    it('should have added two new listeners', () => {
      const listener = jest.fn();
      const listener2 = jest.fn();

      eventBus.addEventListener(eventName, listener);
      eventBus.addEventListener(eventName, listener2);

      expect(eventBus.listeners).toEqual({ ALL: [], james: [listener, listener2] });
    });
  });

  describe('removeEventListener', () => {
    it('should have removed one of the two listeners', () => {
      eventBus.addEventListener(eventName, firstListener);
      eventBus.addEventListener(eventName, secondListener);

      eventBus.removeEventListener(eventName, firstListener);

      expect(eventBus.listeners).toEqual({ ALL: [], james: [secondListener] });
    });

    it("shouldnt have removed listeners when the type does't exist", () => {
      eventBus.addEventListener(eventName, firstListener);
      const previousListeners = { ...eventBus.listeners };

      eventBus.removeEventListener('not-existing-name', firstListener);

      expect(eventBus.listeners).toEqual(previousListeners);
    });
  });

  describe('triggerEvent', () => {
    it('should have called the listener when the event type matches one existing', () => {
      eventBus.addEventListener(eventName, firstListener);

      const someEvent = { type: eventName, someProp: 'someValue' };
      eventBus.triggerEvent(someEvent);

      expect(firstListener).toHaveBeenCalledWith({ ...someEvent, triggeredAt: 42 });
    });

    it("shouldnt have called the listener when the event type doesn't exist", () => {
      const someEvent = { type: 'someWeirdEvent' };
      eventBus.triggerEvent(someEvent);

      expect(firstListener).not.toHaveBeenCalled();
    });

    it('should have logged an error when the listener is in failure', () => {
      const someEvent = { type: eventName };

      const failingListener = jest.fn(() => {
        throw new Error('Something went wrong');
      });

      eventBus.addEventListener(eventName, failingListener);
      eventBus.triggerEvent(someEvent);

      expect(logger.warn).toHaveBeenCalledWith(new Error('Something went wrong'));
    });
  });
});
