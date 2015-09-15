var Extractor = require("./Extractor");
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
  var attributes = this.attributes;
  var defaultLocale = attributes.developmentLocale;
  var extractor = new Extractor();

  // Map eash AST and its request filepath.
  compiler.parser.plugin("program", function(ast) {
    extractor.asts[this.state.current.request] = ast;
  });

  // Sneaks in modules that `require("react-globalize")` and create custom
  // precompiled formatters/parsers for them.
  compiler.parser.plugin("call require:commonjs:item", function(expr, param) {
    var request = this.state.current.request;
    if(param.isString() && param.string === "react-globalize") {
      extractor.getDefaultMessages(request);
      extractor.getExtracts(request);
    }
  });

  compiler.plugin("globalize-before-compile-extracts", function(locale, attributes, request) {
    var defaultMessages = extractor.getDefaultMessages(request);
    var extracts = extractor.getExtracts(request);
    var localeMessages;

    if (extracts) {
      attributes.extracts = attributes.extracts ? arrayClone(alwaysArray(attributes.extracts)) : [];
      [].push.apply(attributes.extracts, alwaysArray(extracts));
    }

    if (defaultMessages) {
      attributes.messages = attributes.messages ? objectDeepClone(attributes.messages) : {};
      localeMessages = attributes.messages[locale] || {};
      attributes.messages[locale] = merge(localeMessages, defaultMessages);
    }

    process.nextTick(function () {
      writeMessages(locale, attributes.messages[locale]);
    });
  });

  function writeMessages(locale, messages) {
    if (!attributes.messages || !attributes.writeMessages) {
      return;
    }

    var path = attributes.messages.replace("[locale]", locale);

    if (locale === defaultLocale) {
      reactGlobalizeCompiler.generateTranslation({
        defaultLocale: defaultLocale,
        defaultMessages: messages,
        filepath: path
      });
    } else {
      reactGlobalizeCompiler.initOrUpdateTranslation({
        defaultMessages: messages,
        filepath: path,
        locale: locale
      });
    }
  }
};

module.exports = ProductionModePlugin;
