/** @jsx React.DOM */

var React = require('React');
var ReactHack = require('ReactHack');

var Button = require('../components/Button');
var CodeMirrorEditor = require('../components/CodeMirrorEditor');
var ComponentPicker = require('../components/ComponentPicker');
var Layout = require('../layout/Layout');
var Project = require('../data/Project');

var EditorPage = React.createClass({
  getInitialState: function() {
    this.project = Project.get('singleton'); // TODO: support multiple projects
    this.project

    var componentName = this.props.routeParams[0];
    var component = this.project.components[componentName];

    return {
      js: component.js,
      css: component.css,
      example: component.example,
      lastSaved: new Date()
    };
  },

  handleCSSChange: function(css) {
    this.setState({css: css});
  },

  handleJSChange: function(js) {
    this.setState({js: js});
  },

  handleExampleChange: function(example) {
    this.setState({example: example});
  },

  componentDidUpdate: function() {
    this.execute();
  },

  componentDidMount: function() {
    var doc = this.refs.preview.getDOMNode().contentDocument;
    var reactScript = doc.createElement('script');
    reactScript.src = 'static/react-0.5.1.js';
    doc.documentElement.appendChild(reactScript);
    doc.documentElement.style.backgroundColor = '#f8f5ec';

    this.contentDiv = doc.createElement('div');
    this.contentDiv.id = '__reactpad_content';
    doc.body.appendChild(this.contentDiv);

    this.messageDiv = doc.createElement('div');
    this.messageDiv.id = '__reactpad_message';
    this.messageDiv.style.display = 'none';
    this.messageDiv.style.border = '1px solid red';
    this.messageDiv.style.margin = '10px';
    this.messageDiv.style.padding = '10px';
    this.messageDiv.style.textAlign = 'center';
    doc.body.appendChild(this.messageDiv);

    setTimeout(this.execute, 1000);
  },

  execute: function() {
    try {
      var transformedSrc = JSXTransformer.transform(
        '/** @jsx React.DOM */var examples = [];var messageDiv = document.getElementById("__reactpad_message");' +
        'try {\n' +
        this.state.js + '\n' +
        this.state.example + '\n' +
        '  var contentDiv = document.getElementById("__reactpad_content");\n' +
        '  examples.forEach(function(e) {\n' +
        '    var c = document.createElement("div");\n' +
        '    contentDiv.appendChild(c);\n' +
        '    React.renderComponent(e, c);\n' +
        '  });' +
        '} catch (e) {' +
        '  messageDiv.innerText = e.toString();\n' +
        '  messageDiv.style.display = "block";\n' +
        '}\n'
      ).code;
    } catch (e) {
      this.messageDiv.innerText = e.toString();
      this.messageDiv.style.display = 'block';
      return;
    }


    var doc = this.refs.preview.getDOMNode().contentDocument;
    this.contentDiv.innerHTML = '';
    this.messageDiv.innerText = '';
    this.messageDiv.style.display = 'none';

    Array.prototype.slice.call(doc.querySelectorAll('style')).forEach(function(child) {
      child.parentNode.removeChild(child);
    });

    var stylesheet = doc.createElement('style');
    stylesheet.type = 'text/css';
    stylesheet.appendChild(doc.createTextNode(this.state.css));

    var srcScript = doc.createElement('script');

    srcScript.text = transformedSrc;

    doc.documentElement.appendChild(stylesheet);
    doc.documentElement.appendChild(srcScript);
  },

  render: function() {
    var componentName = this.props.routeParams[0];

    return (
      <Layout lastSaved={this.state.lastSaved}>
        <div className="row">
          <div className="span2">
            <ComponentPicker project={this.project} current={componentName} />
          </div>
          <div className="span10">
            <div className="row">
              <div className="span5">
                <h4>CSS</h4>
                <CodeMirrorEditor
                  width="100%"
                  height="100px"
                  mode="css"
                  codeText={this.state.css}
                  onChange={this.handleCSSChange}
                />
              </div>
              <div className="span5">
                <h4>Example code</h4>
                <CodeMirrorEditor
                  width="100%"
                  height="100px"
                  mode="javascript"
                  codeText={this.state.example}
                  onChange={this.handleExampleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="span5">
                <h4>JavaScript</h4>
                <CodeMirrorEditor
                  width="100%"
                  height="300px"
                  mode="javascript"
                  codeText={this.state.js}
                  onChange={this.handleJSChange}
                />
              </div>
              <div className="span5">
                <h4>Preview</h4>
                <iframe ref="preview" style={{width: '100%', height: 300}} frameBorder="0" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
});

module.exports = EditorPage;