var extend = require("util")._extend;
var reactGlobalizeCompiler = require("react-globalize-compiler");

function alwaysArray(stringOrArray) {
  return Array.isArray(stringOrArray) ? stringOrArray : stringOrArray ? [stringOrArray] : [];
}

function arrayClone(array) {
  return array.slice(0);
}

// Returns new deeply merged JSON.
//
// Eg.
// merge( { a: { b: 1, c: 2 } }, { a: { b: 3, d: 4 } } )
// -> { a: { b: 3, c: 2, d: 4 } }
//
// @arguments JSON's
function merge() {
  var destination = {},
    sources = [].slice.call(arguments, 0);
  sources.forEach(function(source) {
    var prop;
    for (prop in source) {
      if (prop in destination && typeof destination[prop] === "object" && !Array.isArray(destination[prop])) {
        // Merge Objects
        destination[prop] = merge(destination[prop], source[prop]);
      } else {
        // Set new values
        destination[prop] = source[prop];
      }
    }
  });
  return destination;
}

function objectDeepClone(object) {
  return merge(object);
}

function ProductionModePlugin(attributes) {
  this.attributes = attributes;
}

ProductionModePlugin.prototype.apply = function(compiler) {
  var asts = {};
  var defaultMessages = {};
  var extracts = {};

  function allDefaultMessages() {
    return Object.keys(defaultMessages).reduce(function(sum, request) {
      extend(sum, defaultMessages[request]);
      return sum;
    }, {});
  }

  function allExtracts() {
    return Object.keys(extracts).map(function(request) {
      return extracts[request];
    });
  }

  function getDefaultMessages(request) {
    if (!request) {
      return allDefaultMessages();
    }

    if (!defaultMessages[request]) {
      // Statically extract Globalize & React Globalize default messages.
      defaultMessages[request] = reactGlobalizeCompiler.extractDefaultMessages(asts[request]);
    }

    return defaultMessages[request];
  }

  function getExtracts(request) {
    if (!request) {
      return allExtracts();
    }

    if (!extracts[request]) {
      // Statically extract React Globalize formatters.
      extracts[request] = reactGlobalizeCompiler.extract(asts[request]);
    }

    return extracts[request];
  }

  // Map eash AST and its request filepath.
  compiler.parser.plugin("program", function(ast) {
    asts[this.state.current.request] = ast;
  });

  // Sneaks in modules that `require("react-globalize")` and create custom
  // precompiled formatters/parsers for them.
  compiler.parser.plugin("call require:commonjs:item", function(expr, param) {
    var request = this.state.current.request;
    if(param.isString() && param.string === "react-globalize") {
      getDefaultMessages(request);
      getExtracts(request);
    }
  });

  compiler.plugin("globalize-before-compile-extracts", function(locale, attributes, request) {
    var extracts = getExtracts(request);
    var defaultMessages = getDefaultMessages(request);

    if (extracts) {
      attributes.extracts = attributes.extracts ? arrayClone(alwaysArray(attributes.extracts)) : [];
      [].push.apply(attributes.extracts, alwaysArray(extracts));
    }

    if (defaultMessages) {
      attributes.messages = attributes.messages ? objectDeepClone(attributes.messages) : {};
      attributes.messages[locale] = attributes.messages[locale] || {};
      extend(attributes.messages[locale], defaultMessages);
    }
  });

  /*
  TODO
  // Generate default translation.
  globalizeCompiler.generateDefaultTranslation({
    path,
    defaultLocale,
    defaultMessages
  });

  // Initialize or update translation.
  globalizeCompiler.initOrUpdateTranslation({
    filepath,
    locale
    defaultMessages
  });
  */
};

module.exports = ProductionModePlugin;
