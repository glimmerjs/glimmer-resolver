"use strict";

const build = require('@glimmer/build');
const buildVendorPackage = require('@glimmer/build/lib/build-vendor-package');
const funnel = require('broccoli-funnel');
const path = require('path');

let buildOptions = {};

if (process.env.BROCCOLI_ENV === 'tests') {
  buildOptions.vendorTrees = [
    buildVendorPackage('@glimmer/util'),
    funnel(path.dirname(require.resolve('@glimmer/di/package')), { include: ['dist/amd/es5/**/*.js'] })
  ];
}

module.exports = build(buildOptions);
