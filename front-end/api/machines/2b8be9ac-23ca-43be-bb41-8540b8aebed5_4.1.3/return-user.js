module.exports = {
  "inputs": {
    "user": {
      "id": "d778c0de-681a-4127-9f27-ee0b4e00dc4a",
      "friendlyName": "user",
      "description": "",
      "example": {},
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
      "description": "Normal outcome.",
      "example": {
        "login": "Alice",
        "password": "password",
        "group": 123,
        "id": 123
      }
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    return exits.success(inputs.user);
  },
  "identity": "return-user"
};