"use strict";

const path = require("path");

module.exports = {
  isReactGlobalizeModule: (filepath) => {
    filepath = filepath.split( path.sep );
    const i = filepath.lastIndexOf("react-globalize");
    // 1: path should contain "react-globalize",
    // 2: and it should appear between the end (e.g., ../react-globalize) or 2
    // directories before it (e.g., ../react-globalize/dist/message.js).
    return i !== -1 /* 1 */ && filepath.length - i <= 3 /* 2 */; // eslint-disable-line semi-spacing
  }
};
