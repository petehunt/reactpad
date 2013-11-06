var Parse = require('parse').Parse;

var HomePage = require('./pages/HomePage');
var NewPage = require('./pages/NewPage');
var EditorPage = require('./pages/EditorPage');
var ReactHack = require('ReactHack');

Parse.initialize('', '');

ReactHack.start({
  '': HomePage,
  '__new': NewPage,
  ':component': EditorPage,
});