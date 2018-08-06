import { ALL } from '../constants/events';
import { logger } from '../service/logger';

export const eventBus = new class EventBus {
  constructor() {
    this.listeners = {
      [ALL]: [],
    };
  }

  addEventListener = (eventType, callback) => {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }

    this.listeners[eventType].push(callback);
  };

  removeEventListener = (eventType, callback) => {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(item => item !== callback);
    }
  };

  triggerEvent = event => {
    (this.listeners[event.type] || []).concat(this.listeners[ALL]).forEach(listener => {
      try {
        listener({ ...event, triggered: Date.now() / 1000 });
      } catch (error) {
        logger.warn(error);
      }
    });
  };
}();
