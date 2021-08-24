export default class Events {
   listeners = {};
   emit(event, ...args) {
      if (!this.listeners[event]) return;
      this.listeners[event].forEach(listener => {
         try {
            listener(...args);
         } catch (error) {
            console.error(`[BetterDiscord] Could not fire event [${event}] for ${listener.toString().slice(0, 20)}:`, error);
         }
      });
   }

   get off() { return this.removeListener; }

   on(listener, callback) {
      if (!this.listeners[listener]) this.listeners[listener] = new Set();
      this.listeners[listener].add(callback);
   }
   removeListener(listener, callback) {
      if (!this.listeners[listener]) return;
      this.listeners[listener].delete(callback);
   }
   setMaxListeners() { }
};

Events.EventEmitter = Events;