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
  var defaultMessages = this.defaultMessages;
  return Object.keys(defaultMessages).reduce(function(sum, request) {
    extend(sum, defaultMessages[request]);
    return sum;
  }, {});
};

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
};

Extractor.prototype.allExtracts = function() {
  var extracts = this.extracts;
  return Object.keys(extracts).map(function(request) {
    return extracts[request];
  });
};

Extractor.prototype.getExtracts = function(request) {
  if (!request) {
    return this.allExtracts();
  }

  if (!this.extracts[request]) {
    // Statically extract React Globalize formatters.
    this.extracts[request] = reactGlobalizeCompiler.extract(this.asts[request]);
  }

  return this.extracts[request];
};

module.exports = Extractor;
