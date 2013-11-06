var Graph = require('./Graph');

describe('Graph', function() {
  it('should support CRUD operations for nodes', function() {
    var g = new Graph([new Graph.NodeSpec('xyz')], []);

    expect(g.addNode('xyz', 'abc', {data: 'example'})).toBe(
      g.getNode('xyz', 'abc')
    );

    expect(g.getNode('xyz', 'abc').content).toEqual({data: 'example'});

    expect(g.getNode.bind(g, 'xyz', '123')).toThrow(
      'Invariant Violation: getNode(): Node with key 123 does not exist'
    );

    expect(g.getNode.bind(g, '123', 'abc')).toThrow(
      'Invariant Violation: getNode(): Node with key abc has type xyz; wanted 123'
    );

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
  });
});