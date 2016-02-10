/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var path = require('path');
var util = require('util');

var stack = require('stack-trace');

var rufus = require('./');
var ORIGINAL_METHODS = {};

var root;

function getLogger() {
  var trace = stack.get();

  var filename;
  for (var i = 0, len = trace.length; i < len; i++) {
    filename = trace[i].getFileName();
    if (filename !== __filename && filename !== 'console.js') {
      break;
    }
  }
  var topName = path.basename(root);
  topName = topName.replace(path.extname(topName), '');

  var moduleName = path.join(topName, path.relative(root, filename));
  moduleName = moduleName.replace(path.extname(moduleName), '');

  return rufus.getLogger(moduleName);
}

function replaceConsoleMethodWith(consoleMethod, logMethod) {
  // copy original method
  ORIGINAL_METHODS[consoleMethod] = console[consoleMethod];
  console[consoleMethod] = function() {
    var logger = getLogger();
    logger[logMethod].apply(logger, arguments);
  };
}

function overrideConsole(options) {
  options = options || {};
  root = options.root || path.dirname(stack.get()[1].getFileName());

  console.log(root);

  replaceConsoleMethodWith('log', 'debug');
  replaceConsoleMethodWith('info', 'info');
  replaceConsoleMethodWith('warn', 'warn');
  replaceConsoleMethodWith('error', 'error');

  // console.trace uses console.error
  // console.timeEnd uses console.log

  ORIGINAL_METHODS.dir = console.dir;
  console.dir = function(object) {
    var logger = getLogger();
    logger.debug(util.inspect(object, { customInspect: false }));
  };
}

function restoreConsole() {
  for (var name in ORIGINAL_METHODS) {
    if (ORIGINAL_METHODS.hasOwnProperty(name)) {
      console[name] = ORIGINAL_METHODS[name];
    }
  }
}

module.exports = exports = overrideConsole;
exports.restore = restoreConsole;
