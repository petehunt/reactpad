/** @jsx React.DOM */

var React = require('React');

var ComponentPicker = React.createClass({
  render: function() {
    var children = Object.keys(this.props.project.components).map(function(name) {
      return (
        <li className={name === this.props.current ? 'active' : ''}>
          <a href={'#' + name}>{name}</a>
        </li>
      );
    }, this);

    var divider = null;

    if (children.length > 0) {
      divider = <li className="divider" />;
    }

    return (
      <ul className="nav nav-list">
        {children}
        {divider}
        <li><a href="#__new">Add a new component...</a></li>
      </ul>
    );
  }
});

module.exports = ComponentPicker;