var SAVE_INTERVAL = 2000;

function getComponentTemplate(name) {
  return {
    js: 'var Main = React.createClass({\n  render: function() {\n    return <div className="Main">Hello world</div>;\n  }\n});'.replace(/Main/g, name),
    css: '.Main {\n  color: blue;\n}'.replace('Main', name),
    example: 'examples.push(<Main />);'.replace('Main', name)
  };
}

var Project = function(name, components) {
  this.name = name;
  this.components = components || {
    Main: getComponentTemplate('Main')
  };
  this.autosaveCallbacks = [];
  window.setInterval(this.save.bind(this), SAVE_INTERVAL);
};

Project.prototype.autosave = function(cb) {
  this.autosaveCallbacks.push(cb);
};

Project.prototype.unautosave = function(cb) {
  var i = this.autosaveCallbacks.indexOf(cb);
  if (i === -1) {
    return;
  }
  this.autosaveCallbacks.splice(i, 1);
};


Project.prototype.createComponent = function(name) {
  this.components[name] = getComponentTemplate(name);
};

Project.prototype.updateComponent = function(name, js, css, example) {
  this.components[name] = {js: js, css: css, example: example};
};

Project.prototype.save = function() {
  window.localStorage.setItem('project_' + this.name, JSON.stringify(this.components));
  this.autosaveCallbacks.forEach(function(cb) { cb(); });
};

Project.prototype.getSources = function(componentName) {
  return Object.keys(this.components).map(function(name) {
    var component = this.components[name];
    return {
      name: name,
      js: JSXTransformer.transform('/** @jsx React.DOM */ ' + component.js),
      css: component.css
      example: name === componentName ? component.example : null
    };
  }, this);
};

Project.get = function(name) {
  var json = window.localStorage.getItem('project_' + name);
  return new Project(name, JSON.parse(json));
};

module.exports = Project;