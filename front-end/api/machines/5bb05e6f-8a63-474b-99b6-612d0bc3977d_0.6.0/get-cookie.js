module.exports = {
  "inputs": {
    "Name": {
      "id": "1ae1453c-5483-429a-b614-31ea1de0c66e",
      "friendlyName": "Name",
      "description": "Cookie name",
      "example": "sid",
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
      "description": "Cookie value. If cookie not exist - empty string.",
      "example": "cookie value"
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    return exits.success(env.req.cookies[inputs.Name] || "");
  },
  "identity": "get-cookie"
};