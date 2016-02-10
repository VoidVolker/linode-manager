/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var util = require('util');

var Promise = require('bluebird');

var StreamHandler = require('./stream');

var defaultHighWaterMark = 64 * 1024;

function FileHandler(options) {
  if (typeof options === 'string') {
    options = { file: options };
  }
  this._file = options.file;

  this._init(options);
}
util.inherits(FileHandler, StreamHandler);

FileHandler.prototype._init = function init(options) {
  options.stream = this._open();
  StreamHandler.call(this, options);
};

FileHandler.prototype._open = function open() {
  return fs.createWriteStream(this._file, { flags: 'a', highWaterMark: this.highWaterMark || defaultHighWaterMark });
};

FileHandler.prototype._opened = function opened() {
  this._stream = this._open();
};

FileHandler.prototype.reopen = function reopen() {
  this._stream.end();
  this._stream = this._open();
};

module.exports = FileHandler;
