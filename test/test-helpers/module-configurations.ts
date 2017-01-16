import { ModuleConfiguration, ModuleTypeDefinition, ModuleCollectionDefinition } from '../../src/module-configuration';

export const componentsOnlyConfiguration: ModuleConfiguration = {
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
