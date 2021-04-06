"use strict";

/*
 * abstraction for containing extracted phrases from react-globalize-compiler
 */
const { _extend: extend } = require("util");
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
      this.defaultMessages[
        request
      ] = reactGlobalizeCompiler.extractDefaultMessages(this.asts[request]);
    }

    return this.defaultMessages[request];
  }

  allExtracts() {
    // TODO: Use Object.values()?
    return Object.keys(this.extracts).map((request) => {
      return this.extracts[request];
    });
  }

  getExtracts(request) {
    if (!request) {
      return this.allExtracts();
    }

    if (!this.extracts[request]) {
      // Statically extract React Globalize formatters.
      this.extracts[request] = reactGlobalizeCompiler.extract(
        this.asts[request]
      );
    }

    return this.extracts[request];
  }
}

module.exports = Extractor;
