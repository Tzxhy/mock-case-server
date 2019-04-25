// function shExpMatch(){}

const proxyPaths = {{PROXY_PATHS}};

const proxy = '{{PROXY_ADDR}};';
function FindProxyForURL(url, host) {
    const path = getPath(url);
    if (proxyPaths.indexOf(path) !== -1) {
        return 'PROXY ' + proxy + ' DIRECT;';
    }
    return 'DIRECT;';
}

function getPath(url) {
    return url.match(/https?:\/\/(?:[^\/]*)(\/[^\?#]*)/)[1];
}

