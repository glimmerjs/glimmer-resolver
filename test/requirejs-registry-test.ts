import RequireJSRegistry from '../src/module-registries/requirejs-registry';
import { ResolverConfiguration } from '../src/resolver-configuration';

const { module, test } = QUnit;

module('RequireJS Registry', {
  beforeEach() {
   let config: ResolverConfiguration = {
    app: {
      name: 'example-app',
      rootName: 'example-app'
    },
    types: {
      component: { definitiveCollection: 'components' },
      route: { definitiveCollection: 'routes' },
      router: { definitiveCollection: 'main' },
      template: {
        definitiveCollection: 'routes',
        fallbackCollectionPrefixes: {
          'components': 'components'
        }
      }
    },
    collections: {
      'main': {
        types: ['router']
      },
      components: {
        group: 'ui',
        types: ['component', 'helper', 'template']
      },
      routes: {
        group: 'ui',
        privateCollections: ['components'],
        types: ['route', 'controller', 'template']
      }
    }
  };

  this.config = config;
  this.registry = new RequireJSRegistry(this.config, 'src');
  }
});

test('Normalize', function(assert) {
  assert.expect(5);

  [
    [ 'router:/my-app/main/main', 'my-app/src/router' ],
    [ 'route:/my-app/routes/application', 'my-app/src/ui/routes/application/route' ],
    [ 'template:/my-app/routes/application', 'my-app/src/ui/routes/application/template' ],
    [ 'component:/my-app/components/my-input', 'my-app/src/ui/components/my-input/component' ],

    // have to check why components appears twice in this one, but it works...
    [ 'template:/my-app/components/components/my-input', 'my-app/src/ui/components/my-input/template' ]
  ]
  .forEach(([ lookupString, expected ]) => {
    assert.equal(this.registry.normalize(lookupString), expected);
  })
});