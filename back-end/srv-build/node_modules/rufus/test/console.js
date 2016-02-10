/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/*global describe: true, it:true, before: true, after: true*/

var assert = require('assert');

var rufus = require('../');
var consoleUtil = require('./util/console');

var spy = new rufus.handlers.Null();
spy.handle = function(record) {
  this._lastRecord = record;
  return rufus.handlers.Null.prototype.handle.call(this, record);
};

var prevLog;
var lastMock;
function mockLog() {
  lastMock = arguments;
}

describe('Console replacement', function() {
  before(function() {
    rufus.addHandler(spy);
    prevLog = console.log;
    console.log = mockLog;
    // not passing root means this file becomes root.
    // which means dirname.basename, or test.console
    rufus.console();
  });

  after(function() {
    rufus.console.restore();
    assert.equal(console.log, mockLog);
    console.log = prevLog;
    rufus._handlers = [];
  });


  it('can inject into global scope', function() {
    console.warn('test');
    assert(spy._lastRecord);
    assert.equal(spy._lastRecord.message, 'test');
  });

  it('can generate a name', function() {
    console.log('foo');
    assert.equal(spy._lastRecord.name, 'test.console');

    consoleUtil('bar');
    assert.equal(spy._lastRecord.name, 'test.util.console');
  });
});
