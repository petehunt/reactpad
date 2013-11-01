var SAVE_INTERVAL = 5000;

var Project = function(name, components) {
  this.name = name;
  this.components = components || {
    Main: {
      js: 'var Home = React.createClass({\n  render: function() {\n    return <div className="Home">Hello world</div>;\n  }\n});',
      css: '.Home {\n  color: blue;\n}',
      example: 'examples.push(<Home />);'
    }
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
  this.components[name] = {};
};

Project.prototype.updateComponent = function(name, js, css, example) {
  this.components[name] = {js: js, css: css, example: example};
};

Project.prototype.save = function() {
  window.localStorage.setItem('project_' + this.name, JSON.stringify(this.components));
  this.autosaveCallbacks.forEach(function(cb) { cb(); });
};

Project.get = function(name) {
  var json = window.localStorage.getItem('project_' + name);
  return new Project(name, JSON.parse(json));
};

module.exports = Project;