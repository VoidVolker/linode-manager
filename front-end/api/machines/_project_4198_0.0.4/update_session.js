module.exports = {
  "inputs": {
    "userid": {
      "example": 123,
      "friendlyName": "userid",
      "required": true
    },
    "sid": {
      "example": "abcde12345",
      "friendlyName": "sid",
      "required": true
    },
    "expires": {
      "example": 12345,
      "friendlyName": "expires"
    },
    "criteria": {
      "friendlyName": "criteria",
      "typeclass": "dictionary",
      "description": "Waterline search criteria to use in retrieving Authsession instances"
    }
  },
  "exits": {
    "success": {
      "friendlyName": "then",
      "example": [{
        "userid": 123,
        "sid": "abcde12345",
        "expires": 12345,
        "id": 123,
        "createdAt": "2016-01-06T18:05:51.154Z",
        "updatedAt": "2016-01-06T18:05:51.154Z"
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
    env.sails.models.authsession.update(inputs.criteria, env.sails.util.omit(env.sails.util.objCompact(inputs), 'criteria')).exec(function(err, records) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(records);
    });
  },
  "identity": "update_session"
};