// Toast Manager - Singleton pattern for managing toast notifications
class ToastManager {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  show(message, type = 'info', duration = 3000) {
    this.listeners.forEach(listener => {
      listener({ message, type, duration, id: Date.now() });
    });
  }

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message, duration = 4000) {
    this.show(message, 'error', duration);
  }

  warning(message, duration = 3500) {
    this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }
}

export const toast = new ToastManager();
