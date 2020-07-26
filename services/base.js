
/**
 * @property {Map<string, function>} handlers
 */
class RegisteredHandlers {
    constructor() {
        this.handlers = new Map();
    }

    on(event, handler) {
        this.handlers.set(event, handler);
    }
}

/**
 * @property {CommandoClient} client
 * @property {string} name
 */
module.exports = class Service {
    name = null;
    constructor(client) {
        this.realClient = client;
        this.client = new RegisteredHandlers();
    }

    unload() {
        this.client.handlers.forEach((handler, event) => {
            this.realClient.off(event, handler);
            this.client.handlers.delete(event);
        });
    }

    load() {
        throw new Error("Service does not implement load function");
    }

    appendHandlers() {
        this.client.handlers.forEach((handler, event) => {
            this.realClient.on(event, handler);
        });
    }

    reload() {
        this.unload();
        var path = require.resolve(this.path);
        delete require.cache[path];
        this.realClient.registry.registerServiceFrom(this.path);
    }
};
