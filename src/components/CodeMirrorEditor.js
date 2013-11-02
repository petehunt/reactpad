/** @jsx React.DOM */

var React = require('React');

var CodeMirrorEditor = React.createClass({
  componentDidMount: function(root) {
    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), {
      mode: this.props.mode,
      lineNumbers: false,
      matchBrackets: true,
      theme: 'solarized-light'
    });
    this.editor.setSize(this.props.width, this.props.height);
    this.editor.on('change', this.onChange);
  },

  componentDidUpdate: function(prevProps) {
    if (this.editor.getValue() !== this.props.codeText) {
      this.editor.setValue(this.props.codeText);
    }

    if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
      this.editor.setSize(this.props.width, this.props.height);
    }
  },

  onChange: function() {
    if (this.props.onChange) {
      var content = this.editor.getValue();
      if (content !== this.props.codeText) {
        this.props.onChange(content);
      }
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