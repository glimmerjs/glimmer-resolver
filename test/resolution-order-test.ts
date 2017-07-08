import Resolver from '../src/resolver';
import { ResolverConfiguration } from '../src/resolver-configuration';
import BasicRegistry from '../src/module-registries/basic-registry';

const { module, test } = QUnit;
const modulePrefix = 'example/src';

/**
 * Local module resolution - If a source module is specified and the requested type is allowed in the
 * source module's collection, look in a namespace based on the source module's namespace + name.
 *
 * https://github.com/dgeb/rfcs/blob/module-unification/text/0000-module-unification.md#module-resolutions
 */
module('Resolution order - 1. Local');

test('Identifies `component:my-input` from `template:/app/components/my-form`', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: {
      },
      component: {
        definitiveCollection: 'components'
      }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'template' ],
        defaultType: 'component'
      }
    }
  };
  let registry = new BasicRegistry({
    'component:/app/components/my-form/my-input': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('component:my-input', 'template:/app/components/my-form'), 'component:/app/components/my-form/my-input');
});

test('Identifies `template` from `component:/app/components/my-form`', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: {},
      component: {}
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'template' ],
        defaultType: 'component'
      }
    }
  };
  let registry = new BasicRegistry({
    'template:/app/components/my-form': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('template',
                                       'component:/app/components/my-form'),
                     'template:/app/components/my-form');
});

test('Does not identify `template` at global from `component:/app/components/my-page/my-form`', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: {},
      component: {}
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'template' ],
        defaultType: 'component'
      }
    }
  };
  let registry = new BasicRegistry({
    'template:/app/components/my-form': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('template',
                                       'component:/app/components/my-page/my-form'),
                     undefined);
});

test('Identifies `template` in `components` collection from `template:/app/routes/my-page`', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: {
        definitiveCollection: 'components'
      },
      component: {}
    },
    collections: {
      routes: {
        group: 'ui',
        types: [ 'template' ]
      },
      components: {
        group: 'ui',
        types: [ 'component', 'template' ],
        defaultType: 'component'
      }
    }
  };
  let registry = new BasicRegistry({
    /* Expect that this entry is not matched */
    'template:/app/routes/my-page/my-form': 'a',
    /* Expect that this entry is matched */
    'template:/app/components/my-form': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('template:my-form',
                                       'template:/app/routes/my-page'),
                     'template:/app/components/my-form');
});

/**
 * Private module resolution - If a source module is specified, look in a private collection at the source module's
 * namespace, if one exists that is definitive for the requested type.
 *
 * https://github.com/dgeb/rfcs/blob/module-unification/text/0000-module-unification.md#module-resolutions
 */
module('Resolution order - 2. Private');

test('Identifies `component:my-input` in a private collection from `template:/app/routes/posts`', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: {
        definitiveCollection: 'components'
      },
      component: {
        definitiveCollection: 'components'
      },
      route: {
        definitiveCollection: 'routes'
      }
    },
    collections: {
      components: {
        group: 'ui',
        types: ['component', 'template'],
        defaultType: 'component'
      },
      routes: {
        group: 'ui',
        types: ['route', 'template'],
        privateCollections: ['components']
      }
    }
  };
  let registry = new BasicRegistry({
    'component:/app/routes/posts/-components/my-input': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('component:my-input', 'template:/app/routes/posts'), 'component:/app/routes/posts/-components/my-input');
});

test('Identifies `template` in `components` private collection from `template:/app/routes/my-page`', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: {
        definitiveCollection: 'components'
      }
    },
    collections: {
      routes: {
        group: 'ui',
        types: [ 'template' ]
      },
      components: {
        group: 'ui',
        types: [ 'component', 'template' ],
        defaultType: 'component'
      }
    }
  };
  let registry = new BasicRegistry({
    /* Expect that this entry is not matched */
    'template:/app/routes/my-page/my-form': 'a',
    /* Expect that this entry is matched */
    'template:/app/routes/my-page/-components/my-form': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('template:my-form',
                                       'template:/app/routes/my-page'),
                     'template:/app/routes/my-page/-components/my-form');
});

test('Identifies local lookup in a private collection', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: { definitiveCollection: 'components' },
      component: { definitiveCollection: 'components' }
    },
    collections: {
      routes: {
        group: 'ui',
        types: [ 'template' ]
      },
      components: {
        group: 'ui',
        types: [ 'component', 'template' ],
        defaultType: 'component'
      }
    }
  };
  let registry = new BasicRegistry({
    /* Expect that this entry is not matched */
    'template:/app/routes/my-page/-components/my-form/-components/my-input': 'a',
    /* Expect that this entry is matched */
    'template:/app/routes/my-page/-components/my-form/my-input': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('template:my-input',
                                       'template:/app/routes/my-page/-components/my-form'),
                     'template:/app/routes/my-page/-components/my-form/my-input');
});

/**
 * Associated module resolution - If an associated type is specified, look in the definitive collection for that associated type. Only resolve
 * if the collection can contain the requested type.
 *
 * https://github.com/dgeb/rfcs/blob/module-unification/text/0000-module-unification.md#module-resolutions
 */
module('Resolution order - 3. Associated')

test('Identifies `template:my-input` given the associated type `component`', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: {
      },
      component: {
        definitiveCollection: 'components'
      },
      route: {
        definitiveCollection: 'routes'
      }
    },
    collections: {
      components: {
        group: 'ui',
        types: ['component', 'template'],
        defaultType: 'component'
      },
      routes: {
        group: 'ui',
        types: ['route', 'template'],
        privateCollections: ['components']
      }
    }
  };
  let registry = new BasicRegistry({
    'template:/app/components/my-input': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('template:my-input', 'component'), 'template:/app/components/my-input');
});

/**
 * Top-level module resolution - In the definitive collection for the requested type, defined at its top-level..
 *
 * https://github.com/dgeb/rfcs/blob/module-unification/text/0000-module-unification.md#module-resolutions
 */
module('Resolution order - 4. Top-level');

test('Identifies `component:my-input` at the top-level', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    types: {
      template: {
      },
      component: {
        definitiveCollection: 'components'
      },
      route: {
        definitiveCollection: 'routes'
      }
    },
    collections: {
      components: {
        group: 'ui',
        types: ['component', 'template'],
        defaultType: 'component'
      },
      routes: {
        group: 'ui',
        types: ['route', 'template'],
        privateCollections: ['components']
      }
    }
  };
  let registry = new BasicRegistry({
    'component:/app/components/my-input': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('component:my-input'), 'component:/app/components/my-input');
});

test('Identifies `component:my-input` as the main export from an addon', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    addons: {
      'my-input': {
        name: 'ember-my-input',
        rootName: 'my-input'
      }
    },
    types: {
      template: {
      },
      component: {
        definitiveCollection: 'components'
      },
      route: {
        definitiveCollection: 'routes'
      }
    },
    collections: {
      components: {
        group: 'ui',
        types: ['component', 'template'],
        defaultType: 'component'
      },
      routes: {
        group: 'ui',
        types: ['route', 'template'],
        privateCollections: ['components']
      }
    }
  };
  let registry = new BasicRegistry({
    'component:/my-input/components/main': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('component:my-input'), 'component:/my-input/components/main');
});

test('Identifies `component:my-input/stylized` as an export from an addon', function(assert) {
  let config: ResolverConfiguration = {
    app: {
      name: 'example-app'
    },
    addons: {
      'my-input': {
        name: 'ember-my-input',
        rootName: 'my-input'
      }
    },
    types: {
      template: {
      },
      component: {
        definitiveCollection: 'components'
      },
      route: {
        definitiveCollection: 'routes'
      }
    },
    collections: {
      components: {
        group: 'ui',
        types: ['component', 'template'],
        defaultType: 'component'
      },
      routes: {
        group: 'ui',
        types: ['route', 'template'],
        privateCollections: ['components']
      }
    }
  };
  let registry = new BasicRegistry({
    'component:/my-input/components/stylized': 'a'
  });
  let resolver = new Resolver(config, registry);
  assert.strictEqual(resolver.identify('component:my-input/stylized'), 'component:/my-input/components/stylized');
});
