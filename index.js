"use strict";

const DefaultGlobalizeMessages = require("default-globalize-messages");
const GlobalizePlugin = require("globalize-webpack-plugin");
const ProductionModePlugin = require("./ProductionModePlugin");
const SkipAMDPlugin = require("skip-amd-webpack-plugin");
const util = require("./util");

class ReactGlobalizePlugin {
  constructor(attributes) {
    var customFilter = attributes.moduleFilter;
    this.attributes = attributes;

    if (customFilter && typeof customFilter === "function") {
      this.attributes.moduleFilter = function(path) {
        return customFilter(path) || util.isReactGlobalizeModule(path);
      };
    } else {
      this.attributes.moduleFilter = util.isReactGlobalizeModule;
    }
  }

  apply(compiler) {
    DefaultGlobalizeMessages.set();

    // Plugin GlobalizePlugin.
    const globalizePlugin = new GlobalizePlugin(this.attributes);
    compiler.apply(globalizePlugin);

    // Skip AMD part of ReactGlobalize UMD wrapper.
    const skipAMDPlugin = new SkipAMDPlugin(
      /(^|[\/\\])react-globalize($|[\/\\])/
    );
    skipAMDPlugin.apply(compiler);

    // Production mode only stuff.
    if (this.attributes.production) {
      const productionModePlugin = new ProductionModePlugin(this.attributes);
      compiler.apply(productionModePlugin);
    }
  }
}

module.exports = ReactGlobalizePlugin;
