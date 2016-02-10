module.exports = {
  "inputs": {
    "session": {
      "friendlyName": "session",
      "description": "",
      "example": {},
      "addedManually": true,
      "requiredManually": true,
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
      "description": "Normal outcome.",
      "example": {
        "sid": "abc123",
        "userid": 123,
        "expires": "Wdy, DD-Mon-YYYY HH:MM:SS GMT"
      }
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    return exits.success(inputs.session);
  },
  "identity": "return-session"
};