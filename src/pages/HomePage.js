/** @jsx React.DOM */

var React = require('React');

var Layout = require('../layout/Layout');
var Spinner = require('../components/Spinner');

var HomePage = React.createClass({
  componentDidMount: function() {
    window.location.hash = 'Main';
  },

  render: function() {
    return <Layout><Spinner /></Layout>;
  }
});

module.exports = HomePage;