const build = require('@glimmer/build');
const globSync = require('glob').sync;
const path = require('path');

const glimmerEngine = path.join(path.dirname(require.resolve('glimmer-engine/package')), 'dist/amd/glimmer-common.amd.js');
const glimmerDi = globSync(path.join(path.dirname(require.resolve('@glimmer/di/package')), 'dist/amd/es5/**/*.js'));

module.exports = build({
  testDependencies: [glimmerEngine].concat(glimmerDi)
});
