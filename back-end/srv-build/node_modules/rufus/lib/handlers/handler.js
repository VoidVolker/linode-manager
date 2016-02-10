/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var util = require('util');

var Promise = require('bluebird');

var Formatter = require('../formatter');
var Filterer = require('../filterer');
var LEVELS = require('../levels');

var _defaultFormatter = new Formatter();

function Handler(options) {
  if (typeof options !== 'object') {
    options = { level: options };
  }
  var level = options.level;
  this.setLevel((level !== undefined) ? LEVELS.getLevel(level) : LEVELS.NOTSET);
  if('formatter' in options) {
    this.setFormatter(options.formatter);
  } else if('format' in options) {
    this.setFormatter(new Formatter(options.format));
  }
  this._emit = Promise.promisify(function() {
    return this.emit.apply(this, arguments);
  }, this);
  Handler.all.push(this);
  Filterer.call(this, options);
}
util.inherits(Handler, Filterer);

Handler.all = [];

var proto = {

  level: null,

  _formatter: _defaultFormatter,

  handle: function(record) {
    if (!this.filter(record)) {
      return Promise.fulfilled();
    }
    if (this.emit.length < 2) {
      throw new Error('Handler.emit requires a callback argument');
    }

    return this._emit(record);
  },

  // sub-classes should override emit, not handle
  emit: function emit(/*record, callback*/) {
    throw new Error('Handler.emit must be implemented by sub-classes');
  },

  format: function format(record) {
    return this._formatter.format(record);
  },

  setFormatter: function setFormatter(formatter) {
    this._formatter = formatter;
    return this;
  },

  setLevel: function setLevel(level) {
    this.level = level;
    return this;
  }

};

for (var key in proto) {
  if (proto.hasOwnProperty(key)) {
    Handler.prototype[key] = proto[key];
  }
}

module.exports = Handler;
