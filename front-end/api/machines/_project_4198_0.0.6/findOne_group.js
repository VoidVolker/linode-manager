module.exports = {
  "inputs": {
    "criteria": {
      "friendlyName": "criteria",
      "typeclass": "dictionary",
      "description": "Waterline search criteria to use in retrieving Group instances"
    }
  },
  "exits": {
    "success": {
      "friendlyName": "then",
      "example": {
        "create": "[ \"user/create\", \"group/create\" ]",
        "update": "[ \"user/update\", \"group/update\" ]",
        "read": "[ \"user\", \"group\" ]",
        "delete": "[ \"user/delete\", \"group/delete\" ]",
        "id": 123,
        "createdAt": "2015-12-29T17:41:17.693Z",
        "updatedAt": "2015-12-29T17:41:17.693Z"
      }
    },
    "error": {
      "example": undefined
    },
    "notFound": {
      "void": true
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": undefined,
  "fn": function(inputs, exits, env) {
    env.sails.models.group.findOne(inputs.criteria, env.sails.util.omit(env.sails.util.objCompact(inputs), 'criteria')).exec(function(err, record) {
      if (err) {
        return exits.error(err);
      }
      if (!record) {
        return exits.notFound();
      }
      return exits.success(record);
    });
  },
  "identity": "findOne_group"
};