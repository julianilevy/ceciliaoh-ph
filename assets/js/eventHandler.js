const events = new Map();

const addListener = (element, event, id, callback) => {
  events.set(id, callback);
  element.addEventListener(event, callback);
};

const removeListener = (element, event, id) => {
  element.removeEventListener(event, events.get(id));
  events.delete(id);
};

export { addListener, removeListener };
