'use strict';

/**
 * Module dependencies.
 */

var file = require('fs-utils');
var utils = require('./utils');

/**
 * Default HTML Renderer
 */

var engine = utils.fromStringRenderer('html');


engine.render = function htmlRender(str, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  // cache requires .filename
  if (options.cache && !options.filename) {
    return callback(new Error('the "filename" option is required for caching'));
  }

  try {
    var filepath = options.filename;
    var rendered = options.cache ? engine.cache[filepath] || (engine.cache[filepath] = str) : str;

    callback(null, rendered);
  } catch (err) {
    callback(err);
  }
};

engine.cache = {};

engine.renderFile = function htmlRenderFile(filepath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  try {
    options.filename = filepath;
    var str;

    if (options.cache) {
      str = engine.cache[filepath] || (engine.cache[filepath] = file.readFileSync(filepath));
    } else {
      str = file.readFileSync(filepath);
    }

    engine.render(str, options, callback);
  } catch (err) {
    callback(err);
  }
};


/**
 * Template cache.
 */

engine.cache = {};


/**
 * Express support.
 */

engine.__express = engine.renderFile;

module.exports = engine;