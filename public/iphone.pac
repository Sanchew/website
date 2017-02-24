// var wall_proxy = "PROXY host:port; DIRECT;";
var wall_proxy = "PROXY DIRECT;";

function FindProxyForURL(url, host) {
        return wall_proxy;
}