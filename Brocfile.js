"use strict";

const build = require('@glimmer/build');
const funnel = require('broccoli-funnel');
const path = require('path');

let buildOptions = {};

if (process.env.BROCCOLI_ENV === 'tests') {
  buildOptions.vendorTrees = [
    funnel(path.dirname(require.resolve('@glimmer/di/package')), { include: ['dist/amd/es5/**/*.js'] })
  ];
}

module.exports = build(buildOptions);
