// function shExpMatch(){}

const proxyPaths = {{PROXY_PATHS}};
const regPaths = {{REG_PATHS}};
const proxy = '{{PROXY_ADDR}};';
const proxyToProxy = 'PROXY ' + proxy + ' DIRECT;';

function FindProxyForURL(url, host) {
    const path = getPath(url);
    if (proxyPaths.indexOf(path) !== -1) { // 全等匹配
        return proxyToProxy;
    }
    const flag = regPaths.some((reg) => { // 正则匹配
        if (new RegExp(reg).test(path)) {
            return true;
        }
    });
    if (flag) {
        return proxyToProxy;
    }
    return 'DIRECT;';
}

function getPath(url) {
    return url.match(/https?:\/\/(?:[^\/]*)(\/[^\?#]*)/)[1];
}

