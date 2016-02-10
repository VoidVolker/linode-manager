module.exports = {
  "inputs": {
    "Name": {
      "id": "71f16a9e-dba4-457d-b5e0-168d22808f5a",
      "friendlyName": "Name",
      "description": "Cookie name",
      "example": "cookie_name",
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
      "example": "cookie value"
    },
    "NotFound": {
      "friendlyName": "Not Found",
      "description": "",
      "example": "abc123"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var c = env.req.cookies[inputs.Name];
    if (c === undefined || c === null) {
      return exits.NotFound();
    } else {
      return exits.success(c);
    }
  },
  "identity": "try-get-cookie"
};