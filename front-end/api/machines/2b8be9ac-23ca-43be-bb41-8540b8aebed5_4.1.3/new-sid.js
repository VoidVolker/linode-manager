module.exports = {
  "inputs": {},
  "exits": {
    "error": {
      "example": undefined
    },
    "success": {
      "id": "success",
      "friendlyName": "then",
      "description": "Returns session ID",
      "example": "abc123"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var result = '',
      random = require('crypto').randomBytes(128);

    for (; result.length < 128;) {
      result += random[result.length].toString(32);
    }

    return exits.success(result.slice(-128));
  },
  "identity": "new-sid"
};