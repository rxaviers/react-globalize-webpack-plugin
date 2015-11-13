var DefaultGlobalizeMessages = require("default-globalize-messages");
var GlobalizePlugin = require("globalize-webpack-plugin");
var ProductionModePlugin = require("./ProductionModePlugin");
var SkipAMDOfUMDPlugin = require("skip-amd-webpack-plugin");
var util = require("./util");

function ReactGlobalizePlugin(attributes) {
  var customFilter = attributes.moduleFilter;
  this.attributes = attributes;

  if (customFilter && typeof customFilter === 'function') {
    this.attributes.moduleFilter = function(path) {
      return customFilter(path) || util.isReactGlobalizeModule(path);
    }
  } else {
    this.attributes.moduleFilter = util.isReactGlobalizeModule;
  }
}

ReactGlobalizePlugin.prototype.apply = function(compiler) {
  DefaultGlobalizeMessages.set();

  compiler.apply(
    // Plugin GlobalizePlugin.
    new GlobalizePlugin(this.attributes),

    // Skip AMD part of ReactGlobalize UMD wrapper.
    new SkipAMDOfUMDPlugin(/(^|\/)react-globalize($|\/)/)
  );

  // Production mode only stuff.
  if (this.attributes.production) {
    compiler.apply(new ProductionModePlugin(this.attributes));
  }
};

module.exports = ReactGlobalizePlugin;
