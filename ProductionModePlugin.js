"use strict";

const _async = require("async");
const Extractor = require("./Extractor");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const stringify = require("json-stable-stringify");

function alwaysArray(stringOrArray) {
  return Array.isArray(stringOrArray)
    ? stringOrArray
    : stringOrArray
    ? [stringOrArray]
    : [];
}

function arrayClone(array) {
  return array.slice(0);
}

function compareJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function jsonKeyValue(key, value) {
  var json = {};
  json[key] = value;
  return json;
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
      if (
        prop in destination &&
        typeof destination[prop] === "object" &&
        !Array.isArray(destination[prop])
      ) {
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

function writeMessagesFile(filepath, data) {
  process.nextTick(function() {
    _async.series([
      function(callback) {
        mkdirp(path.dirname(filepath), callback);
      },
      function(callback) {
        fs.writeFile(filepath, stringify(data, { space: 2 }), callback);
      }
    ]);
  });
}

class ProductionModePlugin {
  constructor(attributes) {
    this.attributes = attributes;
  }

  apply(compiler) {
    var attributes = this.attributes;
    var developmentLocale = attributes.developmentLocale;
    var extractor = new Extractor();
    var messages = attributes.messages;
    var writeMessages = attributes.writeMessages;

    const bindParser = parser => {
      // Map each AST and its request filepath.
      parser.hooks.program.tap("ReactGlobalizePlugin", ast => {
        extractor.asts[parser.state.current.request] = ast;
      });

      // Sneaks in modules that `require("react-globalize")` and create custom
      // precompiled formatters/parsers for them.
      parser.plugin("call require:commonjs:item", function(expr, param) {
        var request = this.state.current.request;
        if (param.isString() && param.string === "react-globalize") {
          extractor.getDefaultMessages(request);
          extractor.getExtracts(request);
        }
      });
    };

    compiler.hooks.globalizeBeforeCompileExtracts.tap(
      "ReactGlobalizePlugin",
      (locale, attributes, request) => {
        const defaultMessages = extractor.getDefaultMessages(request);
        const extracts = extractor.getExtracts(request);

        if (extracts) {
          attributes.extracts = attributes.extracts
            ? arrayClone(alwaysArray(attributes.extracts))
            : [];
          [].push.apply(attributes.extracts, alwaysArray(extracts));
        }

        // Note react-globalize-compiler actually extracts the default messages for
        // Globalize and react-globalize <FormatMessage>s. Therefore, the fact
        // defaultMessages is true means there are messages set either by Globalize
        // methods or <FormatMessage>.
        //
        // If in the future, Globalize supports default messages, probably
        // globalize-compile will handle the Globalize default messages and
        // react-globalize-compiler will handle the react-globalize default
        // messages. Therefore, this code will need changes.
        if (defaultMessages) {
          const originalMessages = attributes.messages;

          if (locale === developmentLocale) {
            // Overwrite it with the extracted default messages.
            attributes.messages = jsonKeyValue(locale, defaultMessages);
          } else {
            // Populate the missing messages with the default messages.
            attributes.messages = merge(
              jsonKeyValue(locale, defaultMessages),
              attributes.messages || {}
            );
          }

          // Write messages if:
          // 1: `writeMessages` is true, and
          // 2: processing the whole chunk (i.e., the final i18n bundle where
          //    `request` is null), and
          // 3: messages have changed
          if (
            writeMessages /*1 */ &&
            !request /* 2 */ &&
            !compareJson(originalMessages, attributes.messages) /* 3 */
          ) {
            const filepath = messages.replace("[locale]", locale);
            writeMessagesFile(filepath, attributes.messages);
            if (locale === developmentLocale) {
              console.log(
                `Generated \`${filepath}\` using the default translation.`
              );
            } else {
              console.log(
                `Populated the new fields of \`${filepath}\` using the default translation.`
              );
            }
          }
        }
      }
    );

    compiler.hooks.normalModuleFactory.tap("ReactGlobalizePlugin", factory => {
      factory.hooks.parser
        .for("javascript/auto")
        .tap("ReactGlobalizePlugin", bindParser);
    });
  }
}

module.exports = ProductionModePlugin;
