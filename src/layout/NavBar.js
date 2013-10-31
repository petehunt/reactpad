/** @jsx React.DOM */

var React = require('React');

var NavBar = React.createClass({
  render: function() {
    var items = Object.keys(this.props.project.components).map(function(name) {
      return (
        <li className={this.props.active === name && 'active'} key={name}>
          <a href="#">{name}</a>
        </li>
      );
    }, this);
    return this.transferPropsTo(
      <div className="navbar navbar-inverse navbar-fixed-top">
        <div className="navbar-inner">
          <div className="container">
            <button type="button" className="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="brand" href="#">ReactHack</a>
            <div className="nav-collapse collapse">
              <ul className="nav">
                <li><a href="#">Add new component</a></li>
                {items}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;