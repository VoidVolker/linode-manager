module.exports = {
  "inputs": {
    "criteria": {
      "friendlyName": "criteria",
      "typeclass": "dictionary",
      "description": "Waterline search criteria to use in retrieving User instances"
    },
    "limit": {
      "friendlyName": "limit",
      "example": 123,
      "description": "The maximum number of records to return"
    },
    "skip": {
      "friendlyName": "skip",
      "example": 123,
      "description": "The number of records to skip in the result"
    },
    "sort": {
      "friendlyName": "sort",
      "typeclass": "dictionary",
      "description": "Sort options for results, as a dictionary where the keys are attribute names and values are 1 (ascending) or 0 (descending)"
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
    var query = env.sails.models.user.find(env.sails.util.objCompact(inputs.criteria));
    if (inputs.skip) {
      query = query.skip(inputs.skip);
    }
    if (inputs.limit) {
      query = query.limit(inputs.limit);
    }
    if (inputs.sort) {
      query = query.sort(inputs.sort);
    }
    query.exec(function(err, records) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(records);
    });
  },
  "identity": "find_user"
};