declare var requirejs;
declare var require;
declare var console;

import { ModuleRegistry } from '../module-registry';

import {
  deserializeSpecifier
} from '@glimmer/di';

export default class RequireJSRegistry implements ModuleRegistry {
  private _config: any;
  private _modulePrefix: string;

  constructor(config: any, modulePrefix: string) {
    this._config = config;
    this._modulePrefix = modulePrefix;
  }

  normalize(specifier: string): string {
    let s = deserializeSpecifier(specifier);

    let type = s.collection === 'main' ? s.type : s.collection;
    let collection = this._config.collections[s.collection];
    let group = collection && collection.group;

    if (group) {
      type = `${group}/${type}`;
    }

    let path = `${s.rootName}/${this._modulePrefix}/${type}`;

    if (s.name !== 'main') {
      path += `/${s.name}`;
    }

    if (s.collection !== 'main') {
      path += `/${s.type}`;
    }

    console.log(`requirejs ${specifier} -> ${path}`);
    return path;
  }

  has(specifier: string): boolean {
    let path = this.normalize(specifier);
    return path in requirejs.entries;
  }

  get(specifier: string): any {
    let path = this.normalize(specifier);
    return require(path).default;
  }
}
