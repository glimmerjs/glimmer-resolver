import Resolver from '../src/resolver';
import { ResolverConfiguration } from '../src/resolver-configuration';
import BasicRegistry from '../src/module-registries/basic-registry';

const { module, test } = QUnit;

module('Resolver');

test('can be instantiated, given a ResolverConfiguration and a ModuleRegistry', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      router: { definitiveCollection: 'main' }
    },
    collections: {
      main: {
        types: [ 'router' ]
      }
    }
  };
  let registry = new BasicRegistry();
  let resolver = new Resolver(config, registry);
  assert.ok(resolver, 'resolver has been instantiated');
});

test('#identify - given an absolute specifier, returns that specifier without analysis', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {},
    collections: {}
  };
  let registry = new BasicRegistry();
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('router:/app/main/main'), 'router:/app/main/main');
});

test('#identify - if unspecified, will use the app\'s `rootName` and the `definitiveCollection` for the `type`', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      router: { definitiveCollection: 'main' }
    },
    collections: {
      main: {
        types: [ 'router' ]
      }
    }
  };
  let registry = new BasicRegistry({
    'router:/app/main/main': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('router:main'), 'router:/app/main/main');
});

test('#identify - identifying an unknown type throws an error', function(assert) {
  let config = {
    app: {
      name: 'example-app'
    },
    types: {
      router: { definitiveCollection: 'main' }
    },
    collections: {
      main: {
        types: [ 'router' ]
      }
    }
  };
  let registry = new BasicRegistry();
  let resolver = new Resolver(config, registry);
  assert.throws(() => resolver.identify('unresolvable:main'), new RegExp("'unresolvable' is not a recognized type"));
});

test('#retrieve - given an absolute specifier, retrieves the value from the module registry', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      router: { definitiveCollection: 'main' }
    },
    collections: {
      main: {
        types: [ 'router' ]
      }
    }
  };
  let registry = new BasicRegistry({
    'router:/app/main/main': 'abc'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.retrieve('router:/app/main/main'), 'abc');
});

test('#resolve - identifies then retrieves', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      router: { definitiveCollection: 'main' }
    },
    collections: {
      main: {
        types: [ 'router' ]
      }
    }
  };
  let registry = new BasicRegistry({
    'router:/app/main/main': 'abc'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.resolve('router:/app/main/main'), 'abc');
});

test('#resolve - resolving an undefined module returns `undefined`', function(assert) {
  let config = {
    app: {
      name: 'example-app'
    },
    types: {
      router: { definitiveCollection: 'main' }
    },
    collections: {
      main: {
        types: [ 'router' ]
      }
    }
  };
  let registry = new BasicRegistry();
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.resolve('router:main'), undefined);
});
