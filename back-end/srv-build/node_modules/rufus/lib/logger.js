/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var util = require('util');

var Promise = require('bluebird');

var LEVELS = require('./levels');
var Filterer = require('./filterer');

var SLICE = Array.prototype.slice;

var __loggers = {};
var ROOT = 'root';
var DIVIDER = '.';
var OTHER_DIVIDERS = /[\/\\]/g;

var parentNamesCache = {};
parentNamesCache[ROOT] = [];

function getParentsNames(name) {
  if(!parentNamesCache[name]) {
    var parents = [];
    var parts = name.split(DIVIDER);
    if(parts.length > 1) {
      while(parts.length > 1) {
        parts.pop();
        parents.unshift(parts.join(DIVIDER));
      }
      parents.unshift(ROOT);//root is an end

      parentNamesCache[name] = parents;
    } else {
      parentNamesCache[name] = [ROOT];
    }
  }
  return parentNamesCache[name];
}


function getEffectiveParent(name) {
  if(name === ROOT) {
    return;
  }
  var parentsNames = getParentsNames(name);

  var parent;
  var i = parentsNames.length;
  while(!parent && i--) {
    parent = __loggers[parentsNames[i]];
  }
  return parent;
}

function logAtLevel(level) {
  return function _logAtLevel(msg /*, args...*/) {
    return this._log(level, msg, arguments);
  };
}

function Logger(name) {
  Filterer.call(this);
  if(!name) {
    name = ROOT;
  }
  name = name.replace(OTHER_DIVIDERS, DIVIDER);
  if(name in __loggers) {
    return __loggers[name];
  }
  __loggers[name] = this;
  this._name = name;

  this._handlers = [];
}
util.inherits(Logger, Filterer);

var proto = {

  //_handlers: [],

  _name: null,

  _level: null,

  _handlesExceptions: false,

  _exitOnError: true,

  propagate: true,

  setLevel: function setLevel(level) {
    level = LEVELS.getLevel(level);
    if(level == null)
      throw new Error('Cannot set level with provided value:' + level);
    this._level = level;
    return this;
  },

  /**
   * Returns level which will be used for this logger
   * if logger not explicitly set will be used parent effective level or NOTSET
   * @returns {*}
   * @api private
   */
  getEffectiveLevel: function getEffectiveLevel() {
    if(this._level != null) {
      return this._level;
    } else {
      var parent = getEffectiveParent(this._name);
      if(parent) {
        return parent.getEffectiveLevel();
      } else {
        return LEVELS.NOTSET;
      }
    }
  },

  /**
   * Check if current level can be logged with this logger
   * @param level {Number}
   * @returns {boolean}
   * @api private
   */
  isEnabledFor: function isEnabledFor(level) {
    return level >= this.getEffectiveLevel();
  },

  /**
   * Add handler to logger
   * @param {rufus.Handler} handler
   * @returns {this}
   */
  addHandler: function addHandler(handler) {
    this._handlers.push(handler);
    return this;
  },

  /**
   * Remove handler by instance reference
   * @param {rufus.Handler} handler
   * @returns {this}
   */
  removeHandler: function removeHandler(handler) {
    var index = this._handlers.indexOf(handler);
    if(index !== -1) {
      this._handlers.splice(index, 1);
    }
    return this;
  },

  /**
   * Handlers for this logger
   * @returns {Array}
   */
  getHandlers: function getHandlers() {
    return this._handlers;
  },

  /**
   * Generate actual log record object
   * @param name {String} name of logger
   * @param level {String} record level
   * @param msg {String|Mixed} record message
   * @param args {Array} array of arguments that was passed to log
   * @returns {Object} log record
   * @api private
   */
  makeRecord: function makeRecord(name, level, msg, args) {
    var err;
    if(util.isError(args[args.length - 1])) {
      err = args[args.length - 1];
      args.length = args.length - 1;
    }

    return {
      name: name,
      level: LEVELS[level],
      levelname: level,
      timestamp: new Date(),
      message: msg,
      args: args,
      err: err,
      pid: process.pid
    };
  },

  /**
   * Handle record
   * @param record
   * @returns {Promise}
   * @api private
   */
  handle: function handle(record) {
    var promises = [];

    if(this.filter(record)) {

      var i = this._handlers.length;
      while(i--) {
        if(record.level >= this._handlers[i].level) {
          promises.push(this._handlers[i].handle(record));
        }
      }

      // if this.propagate, tell our parent
      if(this.propagate) {
        var parent = getEffectiveParent(this._name);
        if(parent) {
          promises.push(parent.handle(record));
        }
      }

    }

    if(promises.length > 2) {
      return Promise.all(promises);
    } else if(promises[0]) {
      return promises[0];
    } else {
      return Promise.fulfilled();
    }
  },

  log: function log(level, msg /*, messageArs..., */) {
    var args;
    if(arguments.length < 2) {
      args = [];
    } else {
      args = SLICE.call(arguments, 1);//exclude level
    }

    return this._log(level, msg, args);
  },


  _log: function _log(level, msg, args) {
    var promise;

    if(this.isEnabledFor(LEVELS[level])) {
      promise = this.handle(this.makeRecord(this._name, level, msg, args));
    } else {
      promise = Promise.fulfilled();
    }

    return promise;
  },

  handleExceptions: function handleExceptions(exitOnError/* = true */) {
    this._exitOnError = exitOnError === false ? false : true;
    if(!this._uncaughtException) {
      this._uncaughtException = this.catchException.bind(this);
      process.on('uncaughtException', this._uncaughtException);
    }
  },

  unhandleExceptions: function unhandleExceptions() {
    process.removeListener('uncaughtException', this._uncaughtException);
    delete this._uncaughtException;
  },

  catchException: function catchException(err) {
    var exits = this._exitOnError;

    var promise = this.error('Uncaught exception handled', err);
    if(exits) {
      //XXX: wrap in timeout
      promise.then(function() {
        process.exit(1);
      });
    }
  }
};

// copy proto properties
for(var prop in proto) {
  Logger.prototype[prop] = proto[prop];
}

// copy levels to logger
for(var k in LEVELS) {
  if(typeof LEVELS[k] === 'number') {
    Logger[k] = Logger.prototype[k] = LEVELS[k];
    Logger.prototype[k.toLowerCase()] = logAtLevel(k);
  }
}

module.exports = Logger;
