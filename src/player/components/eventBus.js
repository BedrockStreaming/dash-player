import { ALL } from '../constants/events';

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
        listener(event);
      } catch (error) {
        console.warn(error);
      }
    });
  };
}();
