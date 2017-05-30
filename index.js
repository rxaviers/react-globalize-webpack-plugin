"use strict";

const DefaultGlobalizeMessages = require("default-globalize-messages");
const GlobalizePlugin = require("globalize-webpack-plugin");
const ProductionModePlugin = require("./ProductionModePlugin");
const SkipAMDOfUMDPlugin = require("skip-amd-webpack-plugin");
const util = require("./util");

class ReactGlobalizePlugin {
  constructor(attributes) {
    const customFilter = attributes.moduleFilter;
    this.attributes = attributes;

    if (customFilter && typeof customFilter === "function") {
      this.attributes.moduleFilter = (path) => customFilter(path) || util.isReactGlobalizeModule(path);
    } else {
      this.attributes.moduleFilter = util.isReactGlobalizeModule;
    }
  }

  apply(compiler) {
    DefaultGlobalizeMessages.set();

    compiler.apply(
      // Plugin GlobalizePlugin.
      new GlobalizePlugin(this.attributes),

      // Skip AMD part of ReactGlobalize UMD wrapper.
      new SkipAMDOfUMDPlugin(/(^|[\/\\])react-globalize($|[\/\\])/)
    );

    // Production mode only stuff.
    if (this.attributes.production) {
      compiler.apply(new ProductionModePlugin(this.attributes));
    }
  }
}

module.exports = ReactGlobalizePlugin;
