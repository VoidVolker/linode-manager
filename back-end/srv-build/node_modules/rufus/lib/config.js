/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const path = require('path');

const rufus = require('./');
const Formatter = require('./formatter');
const makeFilter = require('./filter');

const RUFUS_PREFIX = 'rufus/';

function req(str, root) {
  if (str.indexOf(RUFUS_PREFIX) === 0) {
    str = str.replace(RUFUS_PREFIX, './');
  } else if (str.indexOf('./') === 0 || str.indexOf('../') === 0) {
    str = path.join(root || process.cwd(), str);
  }
  return require(str);
}

function configureFormatter(formatterOptions) {
  return new Formatter(formatterOptions);
}

function configureFilter(filterOptions, options) {
  var FilterClass = filterOptions['class'];
  if (typeof FilterClass === 'string') {
    return req(FilterClass, options.root);
  } else {
    return makeFilter(filterOptions);
  }
}

function configureHandler(handler, options) {
  var HandlerClass = handler['class'];
  if (typeof HandlerClass === 'string') {
    HandlerClass = req(HandlerClass, options.root);
  }
  delete handler['class'];
  if (handler.formatter) {
    handler.formatter = options.formatters[handler.formatter];
  }
  var hndlr = new HandlerClass(handler);
  if (handler.filters) {
    handler.filters.forEach(function eachHandler(fname) {
      hndlr.addFilter(options.filters[fname]);
    });
  }
  return hndlr;
}

function getHandler(name, options) {
  var handler = options.handlers[name];
  if(!handler) throw new Error('There is no handler with name: ' + name);
  if (typeof handler.handle !== 'function') {
    handler = options.handlers[name] = configureHandler(handler, options);
  }
  return handler;
}

function configureLogger(name, loggerOptions, options) {
  var logger = rufus.getLogger(name);
  if (loggerOptions.level != null) {
    logger.setLevel(loggerOptions.level);
  }

  if (loggerOptions.handlers) {
    loggerOptions.handlers.forEach(function eachHandler(hName) {
      logger.addHandler(getHandler(hName, options));
    });
  }
  if (loggerOptions.filters) {
    loggerOptions.filters.forEach(function eachHandler(fname) {
      if(!options[fname]) throw new Error('There is no filter with name: ' + fname);
      logger.addFilter(options.filters[fname]);
    });
  }

  if (loggerOptions.propagate != null) {
    logger.propagate = loggerOptions.propagate;
  }

  if (loggerOptions.handleExceptions) {
    logger.handleExceptions(loggerOptions.exitOnError);
  }
}

module.exports = function config(options) {
  // lets do formatters and filters first, since they dont depend on anything
  // then handlers, since they can depend on formatters
  // and then loggers, since they can depend on handlers

  var formatters = options.formatters || {};
  for (var f in formatters) {
    formatters[f] = configureFormatter(formatters[f], options);
  }

  var filters = options.filters || {};
  for (var fi in filters) {
    filters[fi] = configureFilter(filters[fi], options);
  }

  var loggers = options.loggers || {};
  for (var l in loggers) {
    configureLogger(l, loggers[l], options);
  }
};
