function bisect(array, target, start, end, compare) {
  start = start || 0;
  end = end || array.length;

  if (start === end - 1) {
    return end;
  }

  var mid = Math.floor(start + (end - start) / 2);

  if (compare(array[mid], target) < 0) {
    return bisect(array, target, mid, end, compare);
  } else {
    return bisect(array, target, start, mid, compare);
  }
}

function GraphEdgeType(key, unique, inverseKey, inverseUnique, _inverseEdgeType) {
  this.key = key;
  this.unique = unique;
  this.inverse = null;

  if (inverseKey && !_inverseEdgeType) {
    this.inverse = new GraphEdgeType(inverseKey, inverseUnique, this.key, this.unique, this);
  } else if (_inverseEdgeType) {
    this.inverse = _inverseEdgeType;
  }
}

function GraphNode(key, type, data) {
  this.key = key;
  this.type = type;
  this.data = data;
  this.edges = {};
}

GraphNode.prototype.update = function(data) {
  for (var key in data) {
    if (!data.hasOwnProperty(key)) {
      continue;
    }
    this.data[key] = data[key];
  }
};

function GraphEdge(type, node, data, order) {
  this.type = type;
  this.node = node;
  this.data = data;
  this.order = order;
}

function edgeOrderComparator(a, b) {
  return a.order - b.order;
}

GraphNode.prototype.addEdge = function(type, node, data, order, _ignoreInverse) {
  if (!this.edges[type.key]) {
    this.edges[type.key] = [];
  }
  if (!this.getEdge(type, node)) {
    this.edges[type.key].push(new GraphEdge(type, node, data, order));
  }
  if (!_ignoreInverse && type.inverse) {
    other.addEdge(type.inverse, this, null, null, true);
  }
};

GraphNode.prototype.getEdge = function(type, node) {
  var edgesOfType = this.edges[type.key];
  if (!edgesOfType) {
    return null;
  }
  for (var i = 0; i < edgesOfType.length; i++) {
    var edge = edgesOfType[i];
    if (edge.node === node) {
      return edge;
    }
  }
  return null;
};

GraphNode.prototype.getEdgesByType = function(type) {
  return this.edges[type.key] || null;
};

GraphNode.prototype.removeEdge = function(edge) {
  var edgesOfType = this.edges[edge.type.key] || [];
};

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

Project.get = function(name) {
  var json = window.localStorage.getItem('project_' + name);
  return new Project(name, JSON.parse(json));
};

module.exports = Project;