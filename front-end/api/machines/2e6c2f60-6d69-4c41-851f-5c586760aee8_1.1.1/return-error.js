module.exports = {
  "inputs": {
    "msg": {
      "id": "0e824ae2-fa0f-4906-ab4f-d4915fbf4fa4",
      "friendlyName": "Message",
      "description": "Error details message",
      "example": "Unknown error",
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
      "example": {
        "error": {
          "message": "Error message"
        }
      }
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    return exits.success({
      error: {
        message: inputs.msg || "Unknown error"
      }
    });
  },
  "identity": "return-error"
};