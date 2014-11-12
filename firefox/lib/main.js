// Import the page-mod API
var pageMod = require("sdk/page-mod");
// Import the self API
var self = require("sdk/self");

pageMod.PageMod({
  include: [/.*thepiratebay\..*/, /.*194\.71\.107\.80.*/],
  contentScriptFile: [self.data.url("jquery.min.js"), self.data.url("piratebay.js")],
  contentScriptOptions: {
    arrowImg: self.data.url("img/arrows.png"),
    spinnerImg: self.data.url("img/spinner.gif")
  }
});