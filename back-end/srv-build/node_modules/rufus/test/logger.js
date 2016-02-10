/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/*global describe: true, it:true*/

var assert = require('assert');
var sinon = require('sinon');

var rufus = require('../');
var Logger = rufus.Logger;

var __counter = 1;
function unique() {
  return "u-" + __counter++;
}

function spyHandler(level, callback) {
  if(typeof level !== 'number') level = 0;

  var stub = sinon.spy(callback);

  return {
    handle: stub,
    level: level
  };
}

describe('Logger', function() {
  it('should return the same logger when created with the same name', function() {
    var name = unique();

    var logger1 = new Logger(name);
    var logger2 = new Logger(name);

    assert.equal(logger1, logger2);
  });

  it('should allow add handlers and remove them', function() {
    var logger = new Logger(unique());
    var handler = new rufus.handlers.Null();

    logger.addHandler(handler);
    assert.equal(logger.getHandlers().length, 1);

    logger.removeHandler(handler);
    assert.equal(logger.getHandlers().length, 0);
  });

  it('should set by default for child logger log level of its direct parent', function() {
    var parentName = unique();
    var parent = new Logger(parentName);
    parent.setLevel('error');

    var childName = parentName + '.' + unique();
    var child = new Logger(childName);

    assert.equal(child.getEffectiveLevel(), rufus.ERROR);
  });

  it('should make record', function() {
    var name = unique();
    var logger = new Logger(name);

    var msg = 'foo';
    var level = rufus.DEBUG;
    var err = new Error();
    var args = [ msg, err ];
    var record = logger.makeRecord(name, level, msg, args.slice());

    assert.equal(record.name, name);
    assert.equal(record.level, level);
    assert.equal(record.message, msg);
    assert.equal(record.levelname, 'DEBUG');
    assert.equal(record.pid, process.pid);
    assert.equal(record.args.length, args.length - 1); //it is because last arg is Error
    assert.equal(record.args[0], msg);
    assert.equal(record.err, err);
  });

  it('should call its handlers', function() {
    var logger = new Logger(unique());
    logger.propagate = false;

    var handler = spyHandler();
    logger.addHandler(handler);

    logger.log(rufus.INFO, 'foo');
    assert.ok(handler.handle.called);

    logger.info('foo');
    assert.ok(handler.handle.calledTwice);
  });

  it('should call parent handlers when propagate is true', function() {
    var parentName = unique();
    var parent = new Logger(parentName);
    parent.propagate = false; //stop there

    var childName = parentName + '.' + unique();
    var child = new Logger(childName);

    var parentHandler = spyHandler();
    var childHandler = spyHandler();

    parent.addHandler(parentHandler);
    child.addHandler(childHandler);

    child.info('foo');

    assert.ok(childHandler.handle.calledOnce);
    assert.ok(parentHandler.handle.calledOnce);
  });

  it('should call handlers which level is more then record level', function() {
    var logger = new Logger(unique());
    logger.propagate = false;

    var handlerError = spyHandler(rufus.ERROR);
    var handlerTrace = spyHandler(rufus.TRACE);

    logger.addHandler(handlerError).addHandler(handlerTrace);

    logger.info('foo');

    assert.ok(handlerTrace.handle.calledOnce);
    assert.ok(!handlerError.handle.called);
  });

  it('should call handlers when record level more or eql logger level', function() {
    var logger = new Logger(unique());
    logger.propagate = false;
    logger.setLevel(rufus.INFO);

    var handler = spyHandler();
    logger.addHandler(handler);

    logger.info('foo');
    logger.error('foo');
    logger.trace('foo');

    assert.ok(handler.handle.calledTwice);
  });

  it('should allow to filter log records', function() {
    var logger = new Logger(unique());
    logger.propagate = false;

    var handler = spyHandler();
    logger.addHandler(handler);

    logger.addFilter(rufus.makeFilter(/^foo/));

    // message not pass filter
    logger.info('bar');
    assert.ok(!handler.handle.called);

    logger.info('fooooo');
    assert.ok(handler.handle.calledOnce);
  });

  it('should return promise that rejects when one of handlers fail', function(done) {//TODO
    var logger = new Logger(unique());
    logger.propagate = false;

    var h = new rufus.handlers.Null();
    h.emit = function(record, callback) {
      throw new Error('foo');
    };

    logger.addHandler(h);

    logger.info('bar').then(null, function(err) {
      assert.equal(err.message, 'foo');
    }).done(done);
  });
});

module.exports = {
  'Logger': {
    'handleExceptions': {
      'should catch uncaughtErrors': function(done) {
        this.slow(300);

        spawn(false, function(err, stdout, stderr) {
          assert.equal(stderr, 'root.ERROR - Uncaught exception handled');
          done();
        });
      },
      'should not exit if exitOnError is false': function(done) {
        this.slow(300);

        spawn(true, function(err, stdout, stderr) {
          assert.equal(stderr, 'root.ERROR - Uncaught exception handled');
          assert.equal(stdout, 'root.INFO - noexit');
          done();
        });
      }
    }
  }
};

