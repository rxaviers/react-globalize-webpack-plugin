var GlobalizePlugin = require("globalize-webpack-plugin");
var ProductionModePlugin = require("./ProductionModePlugin");
var SkipAMDOfUMDPlugin = require("skip-amd-webpack-plugin");

function ReactGlobalizePlugin(attributes) {
  this.attributes = attributes;
}

ReactGlobalizePlugin.prototype.apply = function(compiler) {
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
