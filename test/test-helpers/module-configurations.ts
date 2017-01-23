import { ResolverConfiguration, ModuleTypeDefinition, ModuleCollectionDefinition } from '../../src/resolver-configuration';

export const componentsOnlyConfiguration: ResolverConfiguration = {
  types: {
    'component': { 
      definitiveCollection: 'components' 
    }
  },
  collections: {
    'components': {
      types: ['component'],
      defaultType: 'component'
    },
    'utils': {
      unresolvable: true
    }
  }
};
