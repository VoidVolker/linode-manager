var EOL = require('os').EOL;

var reUnescapedString = /[\.\^\$\*\+\?\(\)\[\{\\\|\\}\]]/g;

function escapeStringChar(match) {
  return '\\' + match;
}

var compileTimestamp;

module.exports.compileTimestamp = compileTimestamp = function compileTimestamp(format) {

  var source = "", index = 0;

  format.replace(/%([-_0])?(.)/g, function (_, mod, c, offset) {

    source += format.slice(index, offset)
      .replace(reUnescapedString, escapeStringChar);

    var replaceVal = '';

    switch (c) {
      case '%':
        replaceVal = '%'; break;

      case 'A': //Full weekday name *
        replaceVal = '\\w+'; break;

      case 'a': //Abbreviated weekday name *
        replaceVal = '\\w+'; break;

      case 'B': //Full month name *
        replaceVal = '\\w+'; break;

      case 'b': //Abbreviated month name *
        replaceVal = '\\w+'; break;

      case 'c': //Date and time representation *
        replaceVal = compileTimestamp('%a %b %d %Y %H:%M:%S GMT%z (%Z)'); break;

      case 'C': //Year divided by 100 and truncated to integer (00-99)
        replaceVal = '\\d{1,2}'; break;

      case 'D':
        replaceVal = compileTimestamp('%m/%d/%y'); break;

      case 'd': //Day of the month, zero-padded (01-31)
        replaceVal = '\\d{1,2}'; break;

      case 'e': // Day of the month, space-padded ( 1-31)
        replaceVal = '\\d{1,2}'; break;

      case 'F':
        replaceVal = compileTimestamp('%Y-%m-%d'); break;

      case 'H': //Hour in 24h format (00-23)
        replaceVal = '\\d{1,2}'; break;

      case 'h': //Abbreviated month name * (same as %b)
        replaceVal = '\\w+'; break;

      case 'I': //Hour in 12h format (01-12)
        replaceVal = '\\d{1,2}'; break;

      case 'j': //Day of the year (001-366)
        replaceVal = '\\d{1,3}'; break;

      case 'k':
        replaceVal = '\\d{1,2}'; break;

      case 'L':
        replaceVal = '\\d{1,3}'; break;

      case 'l':
        replaceVal = '\\d{1,2}'; break;

      case 'M':
        replaceVal = '\\d{1,2}'; break;

      case 'm':
        replaceVal = '\\d{1,2}'; break;

      case 'n':
        replaceVal = EOL; break;

      //case 'o': replaceVal = String(d.getDate()) + ordinal(d.getDate()); break;
      case 'P':
        replaceVal = '\\w{2}'; break;

      case 'p':
        replaceVal = '\\w{2}'; break;

      case 'R':
        replaceVal = compileTimestamp('%H:%M'); break;

      case 'r':
        replaceVal = compileTimestamp('%I:%M:%S %p'); break;

      case 'S':
        replaceVal = '\\d{1,2}'; break;

      case 's':
        replaceVal = '\\d+'; break;

      case 'T':
        replaceVal = compileTimestamp('%H:%M:%S'); break;

      case 't':
        replaceVal = '\\t'; break;

      case 'U':
        replaceVal = '\\d+'; break;

      case 'u': // 1 - 7, Monday is first day of the week
        replaceVal = '\\d'; break;

      case 'v':
        replaceVal = compileTimestamp('%e-%b-%Y'); break;

      case 'W':
        replaceVal = '\\d'; break;

      case 'w':
        replaceVal = '\\d'; break;

      case 'Y':
        replaceVal = '\\d{4}'; break;

      case 'y':
        replaceVal = '\\d{2}'; break;

      case 'Z':
        replaceVal = '\\w+'; break;

      case 'z':
        replaceVal = '(:?\\+|\\-)\\d{4}'; break;
    }

    source += replaceVal;

    index = offset + _.length;

    return _;
  });

  source += format.substr(index).replace(reUnescapedString, escapeStringChar);

  return source;
};

var RE = /%(-?\d+)?(\.-?\d+)?(\w+)(?:{([a-zA-Z0-9 ,:\-/\\%]+)})?/g;

var compileFormat;
module.exports.compileFormat = compileFormat = function(text, _defaultDateFormat) {
  var defaultDateFormat = _defaultDateFormat || '%Y/%m/%d';

  // assume that original record it is variable rec
  var source = "", index = 0;

  text.replace(RE, function(match, pad, trunc, name, args, offset) {
    // escape characters that cannot be included in string literals
    source += text.slice(index, offset)
      .replace(reUnescapedString, escapeStringChar);

    var replaceVal = '';
    switch(name) {
      case 'd':
      case 'date':
        replaceVal = compileTimestamp(args || defaultDateFormat);
        break;

      case 'pid':
        replaceVal = "\\d+";
        break;

      case 'i':
        replaceVal = "\\d+";
        break;

      case 'X':
        break; //TODO mdc context value

      default:
        replaceVal = "";
    }

    source += replaceVal;

    index = offset + match.length;

    return match;
  });

  source += text.substr(index).replace(reUnescapedString, escapeStringChar);

  return source;
};

var fs = require('fs');
var glob = require('./re-glob');
var Promise = require('bluebird');

glob = Promise.promisify(glob);

var stat = Promise.promisify(fs.stat);
var unlink = Promise.promisify(fs.unlink);

var path = require('path');

//71 file per 354ms, empty 8ms
function FileRemover(opts) {
  if(!opts.fileFormat) throw new Error('fileFormat required');

  this.filesFormat = compileFormat(opts.fileFormat, opts.defaultDateFormat);
  this.timeCache = {};

  this.keepFiles = opts.keepFiles;
}

function compareByTime(f1, f2) {
  return f1[1] - f2[1];
}

FileRemover.prototype.deleteOldFiles = function() {
  var that = this;

  return glob(this.filesFormat).then(function(matchedFiles) {
    return Promise.all(matchedFiles.map(function(file) {
      if(that.timeCache[file])
        return Promise.fulfilled([file, that.timeCache[file]]);
      else
        return stat(file).then(function(s) {
          that.timeCache[file] = s.mtime.getTime();
          return [file, that.timeCache[file]];
        });
    }));
  }).then(function(files) {
    files.sort(compareByTime);
    files.splice(0, that.keepFiles);
    return Promise.all(files.map(function(f) {
      return unlink(f[0]);
    }));
  });
};

module.exports.FileRemover = FileRemover;