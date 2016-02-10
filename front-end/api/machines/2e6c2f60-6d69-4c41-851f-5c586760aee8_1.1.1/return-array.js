module.exports = {
  "inputs": {
    "array": {
      "id": "d617d4cf-6ce5-4a34-843e-2b31b94705f4",
      "friendlyName": "Array",
      "description": "",
      "example": [],
      "defaultsTo": [],
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
      "example": []
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    inputs = inputs.array;
    if (inputs === undefined | inputs === null) {
      return exits.success([]);
    } else {
      return exits.success(inputs);
    }
  },
  "identity": "return-array"
};