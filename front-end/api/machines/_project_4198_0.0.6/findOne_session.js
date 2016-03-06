module.exports = {
  "inputs": {
    "criteria": {
      "friendlyName": "criteria",
      "typeclass": "dictionary",
      "description": "Waterline search criteria to use in retrieving Authsession instances"
    }
  },
  "exits": {
    "success": {
      "friendlyName": "then",
      "example": {
        "userid": 123,
        "sid": "abcde12345",
        "expires": 12345,
        "id": 123,
        "createdAt": "2016-01-06T18:05:51.154Z",
        "updatedAt": "2016-01-06T18:05:51.154Z"
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
    env.sails.models.authsession.findOne(inputs.criteria, env.sails.util.omit(env.sails.util.objCompact(inputs), 'criteria')).exec(function(err, record) {
      if (err) {
        return exits.error(err);
      }
      if (!record) {
        return exits.notFound();
      }
      return exits.success(record);
    });
  },
  "identity": "findOne_session"
};