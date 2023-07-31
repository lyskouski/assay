const cache = require("memory-cache");

const storage = {
    timeout: 60 * 60 * 1000,
    get: (key) => cache.get(key),
    delete: (key) => cache.clear(key),
    set: (key, value) => cache.put(key, value, storage.timeout)
};

module.exports = storage;