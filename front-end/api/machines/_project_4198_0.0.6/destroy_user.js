module.exports = {
  "inputs": {
    "criteria": {
      "friendlyName": "criteria",
      "typeclass": "dictionary",
      "description": "Waterline search criteria to use in retrieving User instances"
    }
  },
  "exits": {
    "success": {
      "friendlyName": "then",
      "example": [{
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
      }]
    },
    "error": {
      "example": undefined
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": undefined,
  "fn": function(inputs, exits, env) {
    env.sails.models.user.destroy(inputs.criteria, env.sails.util.omit(env.sails.util.objCompact(inputs), 'criteria')).exec(function(err, records) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(records);
    });
  },
  "identity": "destroy_user"
};