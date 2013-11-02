var Parse = require('parse').Parse;

var HomePage = require('./pages/HomePage');
var NewPage = require('./pages/NewPage');
var EditorPage = require('./pages/EditorPage');
var ReactHack = require('ReactHack');

Parse.initialize('wy9uD7HHxqkhudWDlCeGJnWPQcUysZd7qOj2ruze', 'OtMLPV7ZJ2tdRwsGxU596eEoC99Mx8t9HyKw3KGK');

ReactHack.start({
  '': HomePage,
  '__new': NewPage,
  ':component': EditorPage,
});