/*
 * node-proxy-test.js: Tests for node-proxy. Reverse proxy for node.js
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var vows = require('vows'),
    sys = require('sys'),
    assert = require('assert'),
    http = require('http');

require.paths.unshift(require('path').join(__dirname, '../lib/'));

var NodeProxy = require('node-proxy').NodeProxy;

//
// Simple 'hello world' response for test purposes
//
var helloWorld = function(req, res) {
  res.sendHeader(200, {'Content-Type': 'text/plain'});
  res.write('hello world')
	res.end();
};

//
// Creates the reverse proxy server
//
var startProxy = function (server, port, proxy) {
  http.createServer(function (req, res){
    // Initialize the nodeProxy and start proxying the request
    proxy.init(req, res);
    proxy.proxyRequest(server, port, req, res);
  }).listen(8080);
};

//
// Creates the 'hellonode' server
//
var startProxyTarget = function () {
  http.createServer(function (req, res) {
    helloWorld(req, res);
  }).listen(8081);
};

//
// The default test bootstrapper
//
var startProxyTest = function () {
  var proxy = new (NodeProxy);
  startProxy('127.0.0.1', 8081, proxy);
  startProxyTarget();
  return proxy;
};

var proxy = startProxyTest();
proxy.emitter.addListener('something', function (body) {
  sys.puts(body);
})

/*vows.describe('node-proxy').addBatch({
  "When an incoming request is proxied to the helloNode server" : {
    topic: function () {
      var proxy = startProxyTest();
      proxy.emitter.addListener('end', this.callback);
      var client = http.createClient(8080, '127.0.0.1');
      client.request('GET', '/');
    },
    "it should received 'hello world'": function (num) {
      sys.puts('got callback');
      //assert.equal(body, 'hello world');
    }
  }
}).export(module);*/