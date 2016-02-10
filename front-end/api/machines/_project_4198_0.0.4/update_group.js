module.exports = {
  "inputs": {
    "create": {
      "example": "[ \"user/create\", \"group/create\" ]",
      "friendlyName": "create"
    },
    "update": {
      "example": "[ \"user/update\", \"group/update\" ]",
      "friendlyName": "update"
    },
    "read": {
      "example": "[ \"user\", \"group\" ]",
      "friendlyName": "read"
    },
    "delete": {
      "example": "[ \"user/delete\", \"group/delete\" ]",
      "friendlyName": "delete"
    },
    "criteria": {
      "friendlyName": "criteria",
      "typeclass": "dictionary",
      "description": "Waterline search criteria to use in retrieving Group instances"
    }
  },
  "exits": {
    "success": {
      "friendlyName": "then",
      "example": [{
        "create": "[ \"user/create\", \"group/create\" ]",
        "update": "[ \"user/update\", \"group/update\" ]",
        "read": "[ \"user\", \"group\" ]",
        "delete": "[ \"user/delete\", \"group/delete\" ]",
        "id": 123,
        "createdAt": "2015-12-29T17:41:17.693Z",
        "updatedAt": "2015-12-29T17:41:17.693Z"
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
    env.sails.models.group.update(inputs.criteria, env.sails.util.omit(env.sails.util.objCompact(inputs), 'criteria')).exec(function(err, records) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(records);
    });
  },
  "identity": "update_group"
};