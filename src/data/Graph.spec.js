var Graph = require('./Graph');

describe('Graph', function() {
  it('should support CRUD operations for nodes', function() {
    var g = new Graph([new Graph.NodeSpec('xyz')], []);

    expect(g.addNode('xyz', 'abc', {data: 'example'})).toBe(
      g.getNode('xyz', 'abc')
    );

    // Getting

    expect(g.getNode('xyz', 'abc').content).toEqual({data: 'example'});

    expect(g.getNodeOrNull('xyz', 'abc')).toEqual(g.getNode('xyz', 'abc'));

    expect(g.getNode.bind(g, 'xyz', '123')).toThrow(
      'Invariant Violation: getNode(): Node with key 123 does not exist'
    );

    expect(g.getNode.bind(g, '123', 'abc')).toThrow(
      'Invariant Violation: getNode(): Node with key abc has type xyz; wanted 123'
    );

    expect(g.getNodeOrNull.bind(g, '123', 'abc')).toThrow(
      'Invariant Violation: getNodeOrNull(): Node with key abc has type xyz; wanted 123'
    );

    // Updating

    expect(g.addNode.bind(g, 'xyz', 'abc')).toThrow(
      'Invariant Violation: addNode(): Node with key abc already exists'
    );

    expect(g.addNode.bind(g, '123', 'def')).toThrow(
      'Invariant Violation: addNode(): nodeSpec 123 does not exist'
    );

    expect(g.updateNode('xyz', 'abc', {data: 'yolo'})).toEqual(
      g.getNode('xyz', 'abc')
    );

    expect(g.getNode('xyz', 'abc').content).toEqual(
      {data: 'yolo'}
    );

    // Removing

    expect(g.removeNode.bind(g, '123', 'abc')).toThrow(
      'Invariant Violation: getNode(): Node with key abc has type xyz; wanted 123'
    );

    expect(g.removeNode.bind(g, 'xyz', 'abc')).not.toThrow();

    expect(g.getNode.bind(g, 'xyz', 'abc')).toThrow(
      'Invariant Violation: getNode(): Node with key abc does not exist'
    );

    expect(g.getNode.bind(g, '123', 'abc')).toThrow(
      'Invariant Violation: getNode(): Node with key abc does not exist'
    );

    expect(g.getNodeOrNull('xyz', 'abc')).toEqual(null);
  });

  it('should support CRUD operations for edges', function() {
    var g = new Graph([
      new Graph.NodeSpec('type1'),
      new Graph.NodeSpec('type2')
    ], [
      new Graph.EdgeSpec('label1', 'type1', 'type2', 'label2'),
      new Graph.EdgeSpec('label2', 'type2', 'type1', 'label1'),
      new Graph.EdgeSpec('bidi', 'type1', 'type1', 'bidi'),
      new Graph.EdgeSpec('uni', 'type1', 'type2')
    ]);

    g.addNode('type1', 'node1');
    g.addNode('type2', 'node2');
    g.addNode('type2', 'node3');
    g.addNode('type1', 'nodeBidi');
    g.addNode('type1', 'loner');

    g.addEdge('label1', 'node1', 'node2', {data: 'cool'}, 100);
    g.addEdge('label1', 'node1', 'node3', {data: 'cooler'}, 1);

    var edges = g.getEdgesByLabel('label1', 'node1');
    expect(Object.keys(edges)).toEqual(['node3', 'node2']);
    expect(edges.node2.data).toEqual({data: 'cool'});
    expect(edges.node3.data).toEqual({data: 'cooler'});

    expect(!!g.getEdge('label2', 'node2', 'node1')).toBe(true);
    expect(!!g.getEdge('label2', 'node3', 'node1')).toBe(true);

    g.addEdge('bidi', 'node1', 'nodeBidi');
    expect(!!g.getEdge('bidi', 'node1', 'nodeBidi')).toBe(true);
    expect(!!g.getEdge('bidi', 'nodeBidi', 'node1')).toBe(true);

    // delete

    g.removeEdge('label1', 'node1', 'node2');
    expect(!!g.getEdgeOrNull('label1', 'node1', 'node2')).toBe(false);
    expect(!!g.getEdgeOrNull('label2', 'node2', 'node1')).toBe(false);

    expect(g.getEdgesByLabel('label1', 'loner')).toEqual({});
    expect(g.getEdgesByLabel('bidi', 'loner')).toEqual({});
    expect(g.getEdgesByLabel('uni', 'loner')).toEqual({});
  });
});