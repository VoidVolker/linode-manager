// Generated by CoffeeScript 1.10.0
var fileValidationRegex, fs, tools;

tools = require('../tools');

fs = require('fs-extra');

fileValidationRegex = /^[\w\-.\s]+$/;

exports.path = process.env.HOME + '/.config/linode-manager-scripts';

exports.init = function() {
  fs.ensureDirSync(this.path);
  return this;
};

exports.load = function(linodeId, filename, cb) {
  var fPath;
  if (!tools.isString(linodeId)) {
    cb(new Error('Invalid linode ID'));
    return;
  }
  if (!tools.isString(fileName)) {
    cb(new Error('Invalid fileName'));
    return;
  }
  fPath = this.path + '/' + linodeId + '/' + fileName;
  return fs.access(fPath, fs.F_OK | fs.R_OK, function(err) {
    if (err) {
      cb(err);
      return;
    }
    return fs.readFile(fPath, function(err, data) {
      if (err) {
        cb(err);
        return;
      }
      return cb(null, data);
    });
  });
};

exports.list = function(linodeId, cb) {
  if (!tools.isString(linodeId)) {
    cb(new Error('Invalid linode ID'));
    return;
  }
  return fs.readdir(this.path + '/' + linodeId, function(err, files) {
    if (err) {
      cb(err);
      return;
    }
    return cb(null, files);
  });
};

exports.save = function(linodeId, fileName, data, cb) {
  if (!tools.isString(linodeId)) {
    cb(new Error('Invalid linode ID'));
    return;
  }
  if (!tools.isString(fileName)) {
    cb(new Error('Invalid fileName'));
    return;
  }
  if (!tools.isString(data)) {
    cb(new Error('Invalid data'));
    return;
  }
  if (!fileName.match(fileValidationRegex)) {
    cb(new Error('Invalid filename'));
    return;
  }
  return fs.outputFile(this.path + '/' + linodeId + '/' + fileName, data, function(err) {
    if (err) {
      return cb(err);
    } else {
      return cb(null);
    }
  });
};

exports.all = function(linodeID) {
  var dir, e, error, file, files, i, j, len, result;
  try {
    dir = this.path + '/' + linodeID;
    fs.ensureDirSync(dir);
    files = fs.readdirSync(dir);
    result = new Array(files.length);
    for (i = j = 0, len = files.length; j < len; i = ++j) {
      file = files[i];
      result[i] = {
        label: {
          value: file
        },
        data: fs.readFileSync(dir + '/' + file).toString()
      };
    }
    return result;
  } catch (error) {
    e = error;
    return [
      {
        error: e.message
      }
    ];
  }
};

//# sourceMappingURL=scripts.js.map