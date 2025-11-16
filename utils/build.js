// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

// Load package.json to get version and description
const path = require('path');
const fs = require('fs');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
process.env.npm_package_version = packageJson.version;
process.env.npm_package_description = packageJson.description;

var webpack = require('webpack'),
  config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

webpack(config, function (err, stats) {
  if (err) {
    console.error(err);
    throw err;
  }
  
  if (stats.hasErrors()) {
    console.error(stats.toString({
      colors: true,
      all: false,
      errors: true,
      warnings: true
    }));
    process.exit(1);
  }
  
  console.log(stats.toString({
    colors: true,
    chunks: false,
    modules: false,
    children: false
  }));
});
