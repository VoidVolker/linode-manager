/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/*global describe: true, it:true*/

var assert = require('assert');

var rufus = require('../');

describe('Filters', function() {
  it('should accept regexp', function() {// regex filter check message
    var f = rufus.makeFilter(/^foo/);

    assert.ok(!f({ message: 'not foobar' }));
    assert.ok(f({ message: 'foobar' }));
  });

  it('should accept string', function() {// string filter check name
    var f = rufus.makeFilter('foo.bar');

    assert(f({
      name: 'foo.bar'
    }));

    assert(f({
      name: 'foo.bar.baz'
    }));

    assert(!f({
      name: 'food.bar'
    }));
  });
});
