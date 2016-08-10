module.exports = {
  isReactGlobalizeModule: function(filepath) {
    filepath = filepath.split( /[\/\\]/ );
    var i = filepath.lastIndexOf("react-globalize");
    // 1: path should contain "react-globalize",
    // 2: and it should appear between the end (e.g., ../react-globalize) or 2
    // directories before it (e.g., ../react-globalize/dist/message.js).
    return i !== -1 /* 1 */ && filepath.length - i <= 3 /* 2 */;
  },
};
