// Utils

function pull(arr, key) {
  var obj = {};
  arr.forEach(function(item) {
    obj[item[key]] = item;
  });
  return obj;
}

function keyOf(x) {
  return Object.keys(x)[0];
}

function sprintf(template) {
  Array.prototype.slice.call(arguments).slice(1).forEach(function(arg) {
    template = template.replace('%s', arg);
  });
  return template;
}

function invariant(condition, message /* ... */) {
  if (!condition) {
    throw new Error('Invariant Violation: ' + sprintf.apply(this, Array.prototype.slice.call(arguments).slice(1)));
  }
}

// Data types (mostly-immutable structs)

function GraphEdge(label, fromKey, toKey, data, order) {
  this.label = label;
  this.fromKey = fromKey;
  this.toKey = toKey;
  this.data = data;
  this.order = order;
}

function GraphNode(type, key, content) {
  this.type = type;
  this.key = key;
  this.content = content;
}

function GraphNodeSpec(type) {
  this.type = type;
}

function GraphEdgeSpec(label, fromType, toType, inverseLabel) {
  this.label = label;
  this.fromType = fromType;
  this.toType = toType;
  this.inverseLabel = inverseLabel;
}

function Graph(nodeSpecs, edgeSpecs, nodes, edges) {
  this.nodeSpecs = pull(nodeSpecs, keyOf({type: null}));
  this.edgeSpecs = pull(edgeSpecs, keyOf({label: null}));
  this.nodes = nodes || {}; // key -> GraphNode
  this.edges = edges || {}; // label -> fromKey -> ordered (toKey -> GraphEdge)
}

// Accessors

Graph.prototype.getNode = function(type, key) {
  var node = this.nodes[key];
  invariant(node, 'getNode(): Node with key %s does not exist', key);
  invariant(node.type === type, 'getNode(): Node with key %s has type %s; wanted %s', key, node.type, type);

  return node;
};

Graph.prototype.getNodeOrNull = function() {
  try {
    return this.getNode.apply(this, arguments);
  } catch (e) {
    return null;
  }
};

Graph.prototype.getEdge = function(label, fromKey, toKey) {
  invariant(this.edgeSpec[label], 'getEdge(): edgeSpec %s does not exist', label);

  var edgesOfType = this.edges[label];
  invariant(edgesOfType, 'getEdge(): No edges with label %s', label);

  var edgesOfTypeFromKey = edgesOfType[fromKey];
  invariant(edgesOfTypeFromKey, 'getEdge(): No edges of label %s from %s', label, fromKey);

  var edge = edgesOfTypeFromKey[toKey];
  invariant(edge, 'getEdge(): No edge of label %s from %s to %s', label, fromKey, toKey);
  return edge;
};

Graph.prototype.getEdgeOrNull = function() {
  try {
    return this.getEdge.apply(this, arguments);
  } catch (e) {
    return null;
  }
};

Graph.prototype.getEdgesByLabel = function(label, fromKey) {
  invariant(this.edgeSpec[label], 'getEdge(): edgeSpec %s does not exist', label);

  var edgesOfType = this.edges[label] || {};
  return edgesOfType[fromKey] || {};
};

// Mutators

Graph.prototype.addNode = function(type, key, content) {
  invariant(!this.nodes[key], 'addNode(): Node with key %s already exists', key);
  invariant(this.nodeSpecs[type], 'addNode() nodeSpec %s does not exist', type);

  var node = new GraphNode(type, key, content);
  this.nodes[key] = node;

  return node;
};

Graph.prototype.updateNode = function(type, key, content) {
  var node = this.nodes[key];
  invariant(node, 'updateNode(): Node with key %s does not exist', key);
  invariant(node.type === type, 'updateNode(): Node with key %s has type %s; wanted %s', key, node.type, type);

  node.content = content;
};

Graph.prototype.addOrUpdateNode = function(type, key, content) {
  var node = this.nodes[key];
  if (!node) {
    this.addNode(type, key, content);
  } else {
    this.updateNode(type, key, content);
  }
};

Graph.prototype.removeNode = function(type, key) {
  // For the invariants
  this.getNode(type, key);
  delete this.nodes[key];

  // Delete edges (both directions) from this node
  for (var label in this.edgeSpecs) {
    var labelEdges = this.edges[label];
    if (labelEdges) {
      var edgesFromNode = labelEdges[key];
      if (edgesFromNode) {
        for (var toKey in edgesFromNode) {
          var edge = edgesFromNode[toKey];
          this.removeEdge(edge.label, edge.fromKey, edge.toKey);
        }

        // Clean up the container (not really needed but w/e
        delete labelEdges[key];
      }
    }
  }
};

Graph.prototype.addEdge = function(label, fromKey, toKey, data, order) {
  var spec = this.edgeSpecs[label];

  invariant(spec, 'addEdge(): Could not find edge spec for %s', label);
  invariant(
    !this.getEdge(label, fromKey, toKey),
    'addEdge(): Edge of label %s between %s and %s exists', label, fromKey, toKey
  );
  invariant(
    !spec.inverseLabel || (!this.getEdge(spec.inverseLabel, toKey, fromKey)),
    'addEdge(): Inverse edge of label %s between %s and %s exists', spec.inverseLabel, toKey, fromKey
  );

  this._insertEdge(new GraphEdge(label, fromKey, toKey, data, order));
  if (spec.inverseLabel) {
    this._insertEdge(new GraphEdge(spec.inverseLabel, toKey, fromKey, data, order));
  }
};

Graph.prototype.updateEdge = function(label, fromKey, toKey, data, order) {
  this.removeEdge(label, fromKey, toKey);
  this.addEdge(label, fromKey, toKey, data, order);
};

Graph.prototype.addOrUpdateEdge = function(label, fromKey, toKey, data, order) {
  var edge = this.getEdge(label, fromKey, toKey);

  if (edge) {
    this.removeEdge(label, fromKey, toKey);
  }

  this.addEdge(label, fromKey, toKey, data, order);
};

Graph.prototype._insertEdge = function(edge) {
  // All invariants are already checked.

  var edgesOfType = this.edges[edge.label];
  if (!edgesOfType) {
    this.edges[edge.label] = edgesOfType = {};
  }

  var edgesOfTypeFromKey = edgesOfType[edge.fromKey];
  if (!edgesOfTypeFromKey) {
    edgesOfType[edge.fromKey] = edgesOfTypeFromKey = {};
  }

  var newEdgesOfTypeFromKey = {};
  var inserted = false;

  for (var toKey in edgesOfTypeFromKey) {
    var existingEdge = edgesOfTypeFromKey[toKey];
    if (!inserted && existingEdge.order > edge.order) {
      // Insert before existingEdge
      newEdgesOfTypeFromKey[edge.toKey] = edge;
      inserted = true;
    }
    newEdgesOfTypeFromKey[toKey] = existingEdge;
  }

  if (!inserted) {
    newEdgesOfTypeFromKey[edge.toKey] = edge;
  }

  edgesOfType[edge.fromKey] = newEdgesOfTypeFromKey;
};

Graph.prototype._deleteEdge = function(label, fromKey, toKey) {
  var edgesOfType = this.edges[label];
  invariant(edgesOfType, '_deleteEdge(): No edges of label %s', label);

  var edgesOfTypeFromKey = edgesOfType[fromKey];
  invariant(edgesOfTypeFromKey, '_deleteEdge(): No edges of label %s from %s', label, fromKey);
  invariant(edgesOfTypeFromKey[toKey], '_deleteEdge(): Could not find edge %s between %s and %s', label, fromKey, toKey);

  delete edgesOfTypeFromKey[toKey];
};

Graph.prototype.removeEdge = function(label, fromKey, toKey) {
  var spec = this.edgeSpecs[label];

  invariant(spec, 'removeEdge(): Could not find edge spec for %s', label);

  this._deleteEdge(label, fromKey, toKey);

  if (spec.inverseLabel) {
    this._deleteEdge(spec.inverseLabel, toey, fromKey);
  }
};

Graph.NodeSpec = GraphNodeSpec;
Graph.EdgeSpec = GraphEdgeSpec;

module.exports = Graph;