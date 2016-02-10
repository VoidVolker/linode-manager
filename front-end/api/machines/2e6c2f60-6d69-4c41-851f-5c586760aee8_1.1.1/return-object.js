module.exports = {
  "inputs": {
    "object": {
      "friendlyName": "Object",
      "description": "",
      "example": {},
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
      "example": {}
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    inputs = inputs.object;
    if (inputs === undefined | inputs === null) {
      return exits.success({});
    } else {
      return exits.success(inputs);
    }
  },
  "identity": "return-object"
};