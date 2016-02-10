module.exports = {
  "inputs": {
    "name": {
      "id": "8dfa550b-67d1-4e8d-a695-b32d42dc39ce",
      "friendlyName": "Name",
      "description": "Cookie name",
      "example": "cookie_name",
      "requiredManually": true,
      "addedManually": true,
      "required": true
    },
    "value": {
      "id": "4e7ba0b1-8c25-46b7-a18a-5e61c0cbfca8",
      "friendlyName": "Value",
      "description": "Cookie value",
      "example": "cookie value",
      "requiredManually": true,
      "addedManually": true,
      "required": true
    },
    "expires": {
      "id": "a0e67767-40e6-4f31-8544-61a8dc7bcb5b",
      "friendlyName": "expires",
      "description": "",
      "example": 123,
      "defaultsTo": 0,
      "addedManually": true
    },
    "type": {
      "id": "f66f7dbe-480a-4f41-a1eb-6526605b06b3",
      "friendlyName": "type",
      "description": "Type of expires number:\nyears\ty\nquarters\tQ\nmonths\tM\nweeks\tw\ndays\t        d\nhours\th\nminutes\tm\nseconds\ts\nmilliseconds\tms",
      "example": "days",
      "defaultsTo": "days",
      "addedManually": true
    }
  },
  "exits": {
    "error": {
      "example": undefined
    },
    "success": {
      "id": "success",
      "friendlyName": "then",
      "description": "",
      "void": true
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var moment = require('moment'),
      exp = inputs.expires,
      type = inputs.type,
      cookie = inputs.name.toString() + '=' + inputs.value.toString(),
      types = [
        "years", "y",
        "quarters", "Q",
        "months", "M",
        "weeks", "w",
        "days", "d",
        "hours", "h",
        "minutes", "m",
        "seconds", "s",
        "milliseconds", "ms"
      ];

    if (exp !== 0 && types.indexOf(type) !== -1) {
      cookie += '; expires=' + moment().utc().add(exp, type).toDate().toGMTString()
    }

    env.res.setHeader('Set-Cookie', cookie);

    return exits.success();
  },
  "identity": "set-cookie"
};