module.exports = {
  "inputs": {
    "data": {
      "id": "223064b3-2e66-42ed-92a7-1f11b781e81c",
      "friendlyName": "data",
      "description": "",
      "example": {},
      "defaultsTo": {},
      "addedManually": true
    }
  },
  "exits": {
    "error": {
      "example": undefined
    },
    "success": {
      "void": true,
      "friendlyName": "then",
      "variableName": "result",
      "description": "Normal outcome."
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    return exits.success(JSON.stringify(inputs.data));
  },
  "identity": "json"
};