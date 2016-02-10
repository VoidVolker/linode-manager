module.exports = {
  "inputs": {
    "boolean": {
      "id": "b1423d9a-71f9-43fc-a44a-b778c3ae1c92",
      "friendlyName": "Boolean",
      "description": "",
      "example": true,
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
      "example": false
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    inputs = inputs.boolean;
    if (inputs !== true) {
      return exits.success(false);
    } else {
      return exits.success(inputs);
    }
  },
  "identity": "return-boolean"
};