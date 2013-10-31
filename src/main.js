var Parse = require('parse').Parse;

var EditorPage = require('./pages/EditorPage');
var ReactHack = require('ReactHack');

Parse.initialize('wy9uD7HHxqkhudWDlCeGJnWPQcUysZd7qOj2ruze', 'OtMLPV7ZJ2tdRwsGxU596eEoC99Mx8t9HyKw3KGK');

ReactHack.start({
  ':component': EditorPage,
});