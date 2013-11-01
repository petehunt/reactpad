/** @jsx React.DOM */

var React = require('React');

var moment = require('moment');

require('./NavBar.css');

var NavBar = React.createClass({
  render: function() {
    var lastSaved = moment(this.props.lastSaved).format('h:mm:ss a');
    return this.transferPropsTo(
      <div className="navbar navbar-inverse navbar-fixed-top">
        <div className="navbar-inner">
          <div className="container">
            <button type="button" className="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="brand" href="#">ReactPad</a>
            <span className="pull-right NavBar-lastSaved">
              Last saved: {lastSaved}
            </span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;