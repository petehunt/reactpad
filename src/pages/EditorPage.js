/** @jsx React.DOM */

var React = require('React');
var ReactHack = require('ReactHack');

var Button = require('../components/Button');
var CodeMirrorEditor = require('../components/CodeMirrorEditor');
var Layout = require('../layout/Layout');

var EditorPage = React.createClass({
  render: function() {
    return (
      <Layout active="home">
        <CodeMirrorEditor width="200px" height="200px" />
        hello world {this.props.routeParams}
      </Layout>
    );
  }
});

module.exports = EditorPage;