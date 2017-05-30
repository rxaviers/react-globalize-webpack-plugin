"use strict";

/*
 * abstraction for containing extracted phrases from react-globalize-compiler
 */
const extend = require("util")._extend;
const reactGlobalizeCompiler = require("react-globalize-compiler");

class Extractor {
  constructor() {
    this.asts = {};
    this.defaultMessages = {};
    this.extracts = {};
  }

  allDefaultMessages() {
    return Object.keys(this.defaultMessages).reduce((sum, request) => {
      extend(sum, this.defaultMessages[request]);
      return sum;
    }, {});
  }

  getDefaultMessages(request) {
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

  allExtracts() {
    const extracts = this.extracts;
    return Object.keys(extracts).map((request) => extracts[request]);
  }

  getExtracts(request) {
    if (!request) {
      return this.allExtracts();
    }

    if (!this.extracts[request]) {
      // Statically extract React Globalize formatters.
      this.extracts[request] = reactGlobalizeCompiler.extract(this.asts[request]);
    }

    return this.extracts[request];
  }
}

module.exports = Extractor;
