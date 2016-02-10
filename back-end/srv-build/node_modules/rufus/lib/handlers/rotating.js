/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var fs = require('fs');
var util = require('util');

var Promise = require('bluebird');

var rename = Promise.promisify(fs.rename);
var stat = Promise.promisify(fs.stat);
var unlink = Promise.promisify(fs.unlink);

var compileFormat = require('../utils/compileFormat');

var FileHandler = require('./file');
var FileRemover = require('../utils/file-remover').FileRemover;

function bytes(n) {
  var b = 0;

  var map = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30
  };

  n.replace(/(\d+)(gb|mb|kb|b)/g, function(_, size, unit) {
    b += map[unit] * parseInt(size, 10);
    return _;
  });
  return b;
}

var timeRates = {
  yearly: function(prev) {
    //at the begining of next year
    return new Date(prev.getFullYear() + 1, 0);
  },
  monthly: function(prev) {
    //at then begining of next month
    return new Date(prev.getFullYear(), prev.getMonth() + 1);
  },
  weekly: function(prev) {
    //begining of next week (as 0 it is Sunday, so next week begins at sunday)
    return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7 - prev.getDay());
  },
  daily: function(prev) {
    //begining of next day
    return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1);
  },
  hourly: function(prev) {
    return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate(), prev.getHour() + 1);
  }
};

function before(date1, date2) { //just check if date1 was earlier date2
  return date1.getTime() < date2.getTime();
}

function RotatingFileHandler(options) {
  FileHandler.call(this, options);
  this._buffer = [];

  if(typeof options.maxSize === 'string') {
    options.maxSize = bytes(options.maxSize);
  }
  if('maxSize' in options) {
    this._maxSize = options.maxSize;
  }
  if('timeRate' in options) {
    this._timeRate = options.timeRate;
    var that = this;
    this._nextRotate = timeRates[this._timeRate] || function(prev) {
      return new Date(prev.getTime() + that._timeRate);
    };
  }

  this._oldFile = options.oldFile || this._fileFormat(this._file);
  this.fileNameFormat = compileFormat(this._oldFile, '%Y%m%d%H%M%S%L');

  if(options.maxFiles) {
    this._remover = new FileRemover({
      fileFormat: this._oldFile,
      defaultDateFormat: '%Y%m%d%H%M%S%L',
      keepFiles: options.maxFiles - 1
    });
  }
}

util.inherits(RotatingFileHandler, FileHandler);

RotatingFileHandler.prototype.emit = function emit(record, callback) {
  this._buffer.push([record, callback]);
  this._flushBuffer();
};

RotatingFileHandler.prototype._flushBuffer = function() {
  var that = this;
  if(this._buffer.length) {
    if(!this.rotating) { //if we already rotating do nothing
      that.rotating = true;
      var t = this._buffer.shift();
      return this.shouldRotate(t[0])
        .then(function(result) {
          return result ? that.rotate() : Promise.fulfilled();
        }).then(function() {
          that._write(t[0], t[1]);
          that.rotating = false;
        }).then(function() {
          that._flushBuffer();
        });
    }
  }
};

RotatingFileHandler.prototype._deleteOldFiles = function() {
  return this._remover ? this._remover.deleteOldFiles() : Promise.fulfilled();
};


RotatingFileHandler.prototype.shouldRotate = function (record) {
  var that = this;
  return this._getData().then(function (t) {
    var sizeExceed = that._maxSize && (t[0] + Buffer.byteLength(that.format(record)) > that._maxSize);
    var timeExceed = that._timeRate && before(that._rotateAt, t[1]);
    return sizeExceed || timeExceed;
  });
};


RotatingFileHandler.prototype._getData = function() {
  if((this._size === undefined && this._maxSize) || (this._timeRate && this._time === undefined)) {
    var that = this;
    return stat(this._file).then(function (stat) {
      that._size = stat.size;
      that._time = stat.mtime;
      if(that._timeRate) {
        that._rotateAt = that._nextRotate(that._time);
      }
      return [that._size, that._time];
    });
  } else {
    return Promise.fulfilled([this._size, this._time]);
  }
};


RotatingFileHandler.prototype.rotate = function _rotate() {
  var that = this;
  this._stream.end();

  return that._rename().then(function () {
    return that._deleteOldFiles().then(function() {
      that._opened();
      that._size = 0;
      if(that._timeRate) {
        that._rotateAt = that._nextRotate(that._rotateAt);
      }
    });
  });
};

RotatingFileHandler.prototype._fileFormat = function(file) {
  var name = file;
  if(this._timeRate) name += '-%d';
  if(this._maxSize) name += '.%i';
  return name;
};

RotatingFileHandler.prototype._write = function write(record, callback) {
  this._size += Buffer.byteLength(this.format(record));
  this._time = record.timestamp;
  FileHandler.prototype.emit.call(this, record, callback);
};

RotatingFileHandler.prototype._rename = function _rename(num) {
  var name = this._file;
  num = num || 0;
  var newName = this.fileNameFormat({ i: num + 1, timestamp: this._rotateAt });
  if (num) {
    name += '.' + num;
  }
  var that = this;
  var def = Promise.pending();
  fs.exists(newName, def.fulfill.bind(def));
  return def.promise.then(function (exists) {
    if (exists) {
      return that._rename(num + 1);
    }
  }).then(function () {
    return rename(name, newName);
  });
};

module.exports = RotatingFileHandler;
