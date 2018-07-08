function parseUrl(url) {
    let result = {};
    let keys = ['href', 'origin', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'];

    let pattern = /(([^:]+:)\/\/(([^\/\?\:]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;

    let match = pattern.exec(url);
    if (match) {
        for (var i = 0; i < keys.length; i++) {
            
        }
    }
}