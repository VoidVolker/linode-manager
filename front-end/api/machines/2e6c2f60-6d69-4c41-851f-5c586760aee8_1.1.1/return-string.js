module.exports = {
  "inputs": {
    "string": {
      "friendlyName": "String",
      "description": "",
      "example": "String",
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
      "example": "String"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    inputs = inputs.string;
    if (inputs === undefined || inputs === null) {
      return exits.success("")
    } else {
      return exits.success(inputs);
    }
  },
  "identity": "return-string"
};