export const Events = {
    handlers: [],
    handle: (event) => {
        Events.handlers
            .filter((e) => e.event === event)
            .forEach((e) => { e.handler(); });
    },
    add: (event, label, handler) => {
        Events.handlers.push({event: event, label: label, handler: handler});
    },
    remove: (event, label) => {
        Events.handlers = Events.handlers.filter((e) => !(e.label === label && e.event === event));
    }
}