class EventConnector {
  constructor() {}

  send(key: string, value: any) {
    const event = new CustomEvent(key, {
      detail: value,
    });
    window.dispatchEvent(event);
  }

  receive(key: string, callback: any) {
    window.addEventListener(key, callback);
  }
}

export { EventConnector };
