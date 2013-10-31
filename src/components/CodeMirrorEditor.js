/** @jsx React.DOM */

var React = require('React');

var CodeMirrorEditor = React.createClass({
  componentDidMount: function(root) {
    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), {
      mode: 'javascript',
      lineNumbers: false,
      matchBrackets: true,
      theme: 'solarized-light'
    });
    this.editor.setSize(this.props.width, this.props.height);
    this.editor.on('change', this.onChange);
    this.onChange();
  },
  onChange: function() {
    if (this.props.onChange) {
      var content = this.editor.getValue();
      this.props.onChange(content);
    }
  },
  render: function() {
    // wrap in a div to fully contain CodeMirror
    return this.transferPropsTo(
      <div className={this.props.className}>
        <textarea ref="editor" defaultValue={this.props.codeText} />
      </div>
    );
  }
});

module.exports = CodeMirrorEditor;