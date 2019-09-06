interface Event {
    name: string;
    label: string;
    handler: Function;
}

export const Events = {
    handlers: [] as Event[],
    emit: (name: string) => {
        Events.handlers
            .filter((e) => e.name === name)
            .forEach((e) => { e.handler(); });
    },
    add: (name: string, label: string, handler: Function) => {
        Events.remove(name, label);
        Events.handlers.push({name: name, label: label, handler: handler});
    },
    remove: (name: string, label: string) => {
        Events.handlers = Events.handlers.filter((e) => !(e.label === label && e.name === name));
    }
}