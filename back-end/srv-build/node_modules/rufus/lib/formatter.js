/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var util = require('util');

var compileFormat = require('./utils/compileFormat');

//stay it still with options, in case i will add something
function Formatter(options) {
  if (typeof options === 'object') {
    if ('format' in options) {
      this._format = options.format;
    }
  } else if (typeof options === 'string') {
    this._format = options;
  }

  this._compiledFormat = compileFormat(this._format);
}

var defaultFormat = '[%date] %-5level %logger - %message%n%error';

Formatter.prototype = {
  _format: defaultFormat,

  format: function format(record) {
    var message = record.message,
      formatted = util.format.apply(util, record.args);

    record.message = formatted;
    formatted = this._compiledFormat(record);

    record.message = message;
    return formatted;
  }
};

module.exports = Formatter;
