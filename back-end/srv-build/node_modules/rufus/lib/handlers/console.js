/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var util = require('util');
var chalk = require('chalk');

var Handler = require('./handler');
var StreamHandler = require('./stream');
var LEVELS = require('../levels');

chalk.enabled = true;

var COLORS = {
  'VERBOSE': chalk.cyan,
  'DEBUG': chalk.blue,
  'INFO': chalk.green,
  'WARN': chalk.yellow,
  'ERROR': chalk.red,
  'CRITICAL': chalk.magenta
};

for(var c in COLORS){
  COLORS[LEVELS[c]] = COLORS[c];
}

function ConsoleHandler(options) {
  options = options || {};

  if('colorize' in options) {
    this._colorize = options.colorize;
  }
  options.stream = process.stdout;
  this._out = new StreamHandler(options);
  options.stream = process.stderr;
  this._err = new StreamHandler(options);

  this._replaceFormat(this._out);
  this._replaceFormat(this._err);
  Handler.apply(this, arguments);
}

util.inherits(ConsoleHandler, Handler);

ConsoleHandler.prototype._colorize = true;

ConsoleHandler.prototype.emit = function consoleEmit(record, callback) {
  var handler = (record.level >= LEVELS.WARN) ? this._err : this._out;
  handler.emit(record, callback);
};

ConsoleHandler.prototype._replaceFormat = function(handler) {
  var origFormat = handler.format;
  var that = this;
  handler.format = function(record) {
    var formatted = origFormat.call(this, record);
    if (that._colorize){
      formatted = COLORS[record.level](formatted);
    }
    return formatted;
  };
};

ConsoleHandler.prototype.setFormatter = function setFormatter(formatter) {
  Handler.prototype.setFormatter.call(this, formatter);
  this._out.setFormatter(formatter);
  this._err.setFormatter(formatter);
};

module.exports = ConsoleHandler;
