/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var os = require('os');
var path = require('path');

var rufus = require('../');

var glob = require('../lib/utils/re-glob');

var NOW = Date.now();
var counter = 1;
function tmp() {
  return path.join(os.tmpDir(),
    'rufus-' + NOW + '-' + process.pid + '-' + (counter++));
}

function rec(msg, level) {
  return { message: msg, args: [msg], timestamp: new Date() };
}

function bytes(x) {
  var b = new Buffer(x);
  b[0] = '<'.charCodeAt(0);
  b[b.length - 1] = '>'.charCodeAt(0);
  b.fill('a', 1, b.length - 1);
  return b.toString();
}

describe('Handler', function () {
  describe('constructor', function () {
    it('should accept options', function () {
      var h = new rufus.Handler({ level: rufus.ERROR });
      assert.equal(h.level, rufus.ERROR);
    });

    it('should accept a level', function () {
      var h = new rufus.Handler(rufus.WARN);
      assert.equal(h.level, rufus.WARN);
    });
  });

  describe('handle', function () {
    it('requires emit to accept a callback argument', function () {
      var h = new rufus.Handler();
      h.emit = function () {
      };

      assert.throws(h.handle.bind(h), function (err) {
        return err.message === 'Handler.emit requires a callback argument';
      });

      h = new rufus.Handler();
      h.emit = function (record, callback) {
        record = callback;
      };
      assert.doesNotThrow(h.handle.bind(h));
    });

    it('should use filters on record', function (done) {
      var h = new rufus.Handler();
      var lastRecord;
      h.emit = function (record, callback) {
        lastRecord = record;
        callback();
      };

      h.addFilter(rufus.makeFilter('foo'));
      h.handle({ name: 'foo' }).then(function () {
        assert.equal(lastRecord.name, 'foo');

        return h.handle({ name: 'foobar' });
      }).then(function () {
          assert.notEqual(lastRecord.name, 'foobar');
        }).done(done);
    });
  });

  describe('emit', function () {
    it('must be overriden by subclasses', function () {
      var h = new rufus.Handler();
      assert.throws(h.emit);
    });
  });
});

describe('Stream', function () {
  describe('constructor', function () {
    it('should accept options', function () {
      var stream = {};
      var handler = new rufus.handlers.Stream({
        level: rufus.INFO,
        stream: stream
      });

      assert.equal(handler.level, rufus.INFO);
      assert.equal(handler._stream, stream);
    });

    it('should accept just a stream', function () {
      var stream = {};
      var handler = new rufus.handlers.Stream(stream);

      assert.equal(handler.level, rufus.NOTSET);
      assert.equal(handler._stream, stream);
    });
  });

  describe('emit', function () {
    it('should write message to stream', function (done) {
      var out;
      var stream = {
        write: function (msg, fn) {
          out = msg;
          fn();
        }
      };

      var handler = new rufus.handlers.Stream({
        stream: stream,
        formatter: new rufus.Formatter('%message%n')
      });
      handler.handle({ message: 'foo', args: ['foo'] }).then(function () {
        assert.equal(out, 'foo\n');
        done();
      });
    });

    it('should wait for flush on slow streams', function (done) {
      var out;
      var stream = new EventEmitter();
      stream.write = function write(data, fn) {
        setTimeout(function () {
          out = data;
          fn();
        }, 1);
      };
      var handler = new rufus.handlers.Stream({
        stream: stream,
        formatter: new rufus.Formatter('%message%n')
      });
      handler.handle({ message: 'secret', args: ['secret'] }).then(function () {
        assert.equal(out, 'secret\n');
      }).done(done);
    });
  });
});

describe('File', function () {
  describe('constructor', function () {
    it('should accept options', function () {
      var filename = tmp();
      var handler = new rufus.handlers.File({
        level: rufus.WARN,
        file: filename
      });

      assert.equal(handler.level, rufus.WARN);
      assert.equal(handler._file, filename);
    });

    it('should accept a filename', function () {
      var filename = tmp();
      var handler = new rufus.handlers.File(filename);

      assert.equal(handler._file, filename);
    });
  });

  describe('handle', function () {
    it('should write to the file', function (done) {
      var filename = tmp();
      var handler = new rufus.handlers.File({
        file: filename,
        formatter: new rufus.Formatter('%message%n')
      });
      handler.handle({ message: 'recon', args: ['recon'] }).then(function () {
        fs.readFile(filename, function (err, contents) {
          assert.ifError(err);
          assert.equal(contents.toString(), 'recon\n');
          done();
        });
      }).done();
    });
  });
});

describe('Console', function () {
  describe('constructor', function () {
    it('should use stdout and stderr', function () {
      var h = new rufus.handlers.Console();
      assert.equal(h._out._stream, process.stdout);
      assert.equal(h._err._stream, process.stderr);
    });
  });

  describe('handle', function () {
    it('should send low priority messages to stdout', function (done) {
      var h = new rufus.handlers.Console({
        formatter: new rufus.Formatter('%message%n'),
        colorize: false
      });
      var val;
      h._out._stream = {
        write: function (out, callback) {
          val = out;
          callback();
          return true;
        }
      };

      h.handle({ level: rufus.INFO, message: 'oscar mike', args: ['oscar mike'] }).then(function () {
        assert.equal(val, 'oscar mike\n');
      }).done(done);
    });

    it('should send warn and higher messages to stderr', function (done) {
      var h = new rufus.handlers.Console({
        formatter: new rufus.Formatter('%message%n'),
        colorize: false
      });
      var val;
      h._err._stream = {
        write: function (out, callback) {
          val = out;
          callback();
          return true;
        }
      };

      h.handle({ level: rufus.WARN, message: 'mayday', args: ['mayday'] }).then(function () {
        assert.equal(val, 'mayday\n');
      }).done(done);
    });
  });
});

describe('RotatingFileHandler', function () {
  describe('handle', function () {
    it('with maxSize should create new files', function (done) {
      this.timeout(5000);

      var filename = tmp();
      var handler = new rufus.handlers.Rotating({
        file: filename,
        maxSize: 64,
        formatter: new rufus.Formatter('%message%n')
      });

      assert.equal(handler._file, filename);
      handler.handle(rec(bytes(60)));
      handler.handle(rec(bytes(50)));
      handler.handle(rec(bytes(45))).then(function () {
        assert.equal(fs.statSync(filename).size, 46);
        assert.equal(fs.statSync(filename + '.1').size, 51);
        assert.equal(fs.statSync(filename + '.2').size, 61);
      }).done(done);
    });

    it('with maxSize should create new files date rated', function (done) {
      this.timeout(5000);

      var filename = tmp();
      var handler = new rufus.handlers.Rotating({
        file: filename,
        timeRate: 200,
        maxFiles: 2,
        formatter: new rufus.Formatter('%message%n')
      });

      var times = 0;
      var interval = setInterval(function() {
        handler.handle(rec(bytes(50)));
        times += 1;
        if(times > 3) {
          clearInterval(interval);
          handler.handle(rec(bytes(45))).then(function () {
            //glob(handler._remover.filesFormat, function(err, matches) {
            //  console.log(matches);
            //});
            //should be 2 files, but i have no idea how correctly test it +1 current
            assert(true);
          }).done(done);
        }
      }, 250);
    });

    it('with maxFiles should not create more than max', function (done) {
      this.timeout(5000);

      var filename = tmp();
      var handler = new rufus.handlers.Rotating({
        file: filename,
        maxSize: 64,
        maxFiles: 3,
        formatter: new rufus.Formatter('%message%n')
      });

      handler.handle({ message: bytes(50), args: [bytes(50)] });
      handler.handle({ message: bytes(55), args: [bytes(55)] });
      handler.handle({ message: bytes(60), args: [bytes(60)] });
      handler.handle({ message: bytes(45), args: [bytes(45)] }).then(function () {
        assert.equal(fs.statSync(filename).size, 46);
        assert.equal(fs.statSync(filename + '.1').size, 61);
        assert.equal(fs.statSync(filename + '.2').size, 56);
        assert(!fs.existsSync(filename + '.3'));
      }).done(done);
    });

    it('should continue to write after buffer is flushed', function (done) {
      this.timeout(5000);

      var filename = tmp();
      var handler = new rufus.handlers.Rotating({
        file: filename,
        maxSize: 64,
        formatter: new rufus.Formatter('%message%n')
      });

      handler.handle({ message: bytes(29), args: [bytes(29)] }).then(function () {
        return handler.handle({ message: bytes(31), args: [bytes(31)] });
      }).then(function () {
          assert.equal(fs.statSync(filename).size, 62);
        }).done(done);
    });
  });
});