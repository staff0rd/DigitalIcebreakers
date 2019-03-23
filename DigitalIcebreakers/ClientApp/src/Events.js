export const Events = {
    handlers: [],
    handle: (event) => {
        console.log('handle ', event, Events.handlers);
        Events.handlers
            .filter((e) => e.event === event)
            .forEach((e) => { e.handler(); });
    },
    add: (event, label, handler) => {
        Events.handlers.push({event: event, label: label, handler: handler});
    }
}