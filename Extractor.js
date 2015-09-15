/*
 * abstraction for containing extracted phrases from react-globalize-compiler
 */
var extend = require("util")._extend;
var reactGlobalizeCompiler = require("react-globalize-compiler");

function Extractor() {
  this.asts = {};
  this.defaultMessages = {};
  this.extracts = {};
}

Extractor.prototype.allDefaultMessages = function() {
  return Object.keys(this.defaultMessages).reduce(function(sum, request) {
    extend(sum, this.defaultMessages[request]);
    return sum;
  }, {});
}

Extractor.prototype.getDefaultMessages = function(request) {
  if (!request) {
    return this.allDefaultMessages();
  }

  if (!this.defaultMessages[request]) {
    // Statically extract Globalize & React Globalize default messages.
    this.defaultMessages[request] =
      reactGlobalizeCompiler.extractDefaultMessages(this.asts[request]);
  }

  return this.defaultMessages[request];
}

Extractor.prototype.allExtracts = function() {
  return Object.keys(this.extracts).map(function(request) {
    return this.extracts[request];
  });
}

Extractor.prototype.getExtracts = function(request) {
  if (!request) {
    return this.allExtracts();
  }

  if (!this.extracts[request]) {
    // Statically extract React Globalize formatters.
    this.extracts[request] = reactGlobalizeCompiler.extract(this.asts[request]);
  }

  return this.extracts[request];
}

module.exports = Extractor;
