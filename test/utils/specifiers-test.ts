import {
  deserializeSpecifier
} from '@glimmer/di';
import { detectLocalResolutionCollection } from '../../src/utils/specifiers';

const { module, test } = QUnit;

module('Specifier utils');

test('detectLocalResolutionCollection - favors a private collection over the top-level collection', function(assert) {
  let specifier = deserializeSpecifier('template:/app/routes/my-page/-components/my-form/my-input');
  assert.equal(detectLocalResolutionCollection(specifier), 'components');
});

test('detectLocalResolutionCollection - favors the most-local private collection over any other collections', function(assert) {
  let specifier = deserializeSpecifier('template:/app/routes/my-page/-components/my-form/-helpers/my-input');
  assert.equal(detectLocalResolutionCollection(specifier), 'helpers');
});

test('detectLocalResolutionCollection - uses the top-level collection if no private collections are present', function(assert) {
  let specifier = deserializeSpecifier('component:/app/components/my-form/my-input');
  assert.equal(detectLocalResolutionCollection(specifier), 'components');
});
