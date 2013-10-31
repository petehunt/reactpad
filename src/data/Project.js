var Project = function(name, components) {
  this.name = name;
  this.components = components || {
    Main: {
      js: 'var Home = React.createClass({\n  render: function() {\n    return <div className="Home">Hello world</div>;\n  }\n});',
      css: '.Home {\n  color: blue;\n}',
      example: 'examples.push(<Home />);'
    }
  };
};

Project.prototype.createComponent = function(name) {
  this.components[name] = {};
};

Project.prototype.saveComponent = function(name, js, css, example) {
  this.components[name] = {js: js, css: css, example: example};
};

Project.prototype.save = function() {
  window.localStorage.setItem(this.name, this.components);
};

Project.get = function(name) {
  var json = window.localStorage.getItem('project_' + name);
  return new Project(name, json);
};

module.exports = Project;