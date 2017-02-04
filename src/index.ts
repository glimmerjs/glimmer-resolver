export { default } from './resolver';
export { default as BasicModuleRegistry } from './module-registries/basic-registry';
export { default as RequireJSModuleRegistry } from './module-registries/requirejs-registry';

export { ModuleRegistry } from './module-registry';
export {
  PackageDefinition,
  ModuleTypeDefinition,
  ModuleCollectionDefinition,
  ResolverConfiguration
} from './resolver-configuration';
