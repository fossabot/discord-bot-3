const { CommandoRegistry } = require("@iceprod/discord.js-commando");
const requireAll = require("require-all");
const path = require("path");

function requireDirectory(directory) {
    return requireAll({
        dirname: require("path").join(directory)
    });
}

module.exports = class ServiceEnabledRegistry extends CommandoRegistry {
    constructor(client) {
        super(client);
        this.services = new Map();
    }

    registerService(service) {
        service.load();
        service.appendHandlers();
        console.log("[SERVICE-LOAD]", service.name.blue, "-", service.client.handlers.size, "listeners");
        this.services.set(service.name, service);

        return this;
    }

    registerServiceFrom(path) {
        var Service = require(path);
        this.registerService(new Service(this.client));

        return this;
    }

    registerServicesIn(dir) {
        var services = requireDirectory(dir);
        for(var ServiceName in services) {
            const Service = services[ServiceName];
            if(!Service) continue;
            try {
                var s = new Service(this.client);
                s.path = path.join(dir, ServiceName);
                this.registerService(s);
            } catch(e) {
                console.error(e);
            }
        }

        return this;
    }

    unregisterService(service) {
        service.unload();
        this.services.remove(service.name, service);

        return this;
    }

    reregisterService(service, current) {
        current.unload();
        service.load();
        service.appendHandlers();
        this.services.set(service.name, service);

        return this;
    }
};
