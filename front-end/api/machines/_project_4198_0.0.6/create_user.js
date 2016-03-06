module.exports = {
  "inputs": {
    "password": {
      "example": "password_123",
      "friendlyName": "password",
      "required": true
    },
    "email": {
      "example": "user@example.com",
      "friendlyName": "email"
    },
    "login": {
      "example": "User",
      "friendlyName": "login",
      "required": true
    },
    "group": {
      "example": 123,
      "friendlyName": "group"
    },
    "name1": {
      "example": "Marty",
      "friendlyName": "name1"
    },
    "name2": {
      "example": "McFly",
      "friendlyName": "name2"
    },
    "name3": {
      "example": "Seamus",
      "friendlyName": "name3"
    }
  },
  "exits": {
    "success": {
      "friendlyName": "then",
      "example": {
        "password": "password_123",
        "email": "user@example.com",
        "login": "User",
        "group": 123,
        "name1": "Marty",
        "name2": "McFly",
        "name3": "Seamus",
        "id": 123,
        "createdAt": "2015-12-29T17:38:43.551Z",
        "updatedAt": "2015-12-29T17:38:43.551Z"
      }
    },
    "error": {
      "example": undefined
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": undefined,
  "fn": function(inputs, exits, env) {
    env.sails.models.user.create(env.sails.util.objCompact(inputs)).exec(function(err, records) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(records);
    });
  },
  "identity": "create_user"
};