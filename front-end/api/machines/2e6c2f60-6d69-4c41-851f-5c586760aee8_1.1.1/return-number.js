module.exports = {
  "inputs": {
    "number": {
      "friendlyName": "Number",
      "description": "",
      "example": 123,
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
      "description": "Normal outcome.",
      "example": 123
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    inputs = inputs.number;
    if (inputs !== undefined && inputs === inputs) {
      return exits.success(inputs);
    } else {
      return exits.success(0);
    }
  },
  "identity": "return-number"
};