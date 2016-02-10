module.exports = {
  "inputs": {
    "offset": {
      "friendlyName": "offset",
      "description": "Offset number",
      "example": 123,
      "addedManually": true,
      "requiredManually": true,
      "required": true
    },
    "type": {
      "id": "77643aa2-b722-41d7-a4b9-876b9333add3",
      "friendlyName": "type",
      "description": "Offset time type:\nyears\ty\nquarters\tQ\nmonths\tM\nweeks\tw\ndays\t        d\nhours\th\nminutes\tm\nseconds\ts\nmilliseconds\tms",
      "example": "months",
      "requiredManually": true,
      "addedManually": true,
      "required": true
    }
  },
  "exits": {
    "error": {
      "example": undefined
    },
    "success": {
      "id": "success",
      "friendlyName": "then",
      "description": "Return Unix time offset",
      "example": 12345
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var moment = require('moment'),
      offset = inputs.offset,
      type = inputs.type,
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

    if (offset !== 0 && types.indexOf(type) !== -1) {
      return exits.success(moment.utc().add(offset, type).unix());
    } else {
      return exits.error("Wrong input format");
    }


  },
  "identity": "date-string"
};