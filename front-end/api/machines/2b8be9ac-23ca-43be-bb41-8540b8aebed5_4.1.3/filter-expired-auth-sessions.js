module.exports = {
  "inputs": {
    "sessions": {
      "friendlyName": "sessions",
      "description": "Auth Sessions array",
      "example": [],
      "addedManually": true,
      "requiredManually": true,
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
      "description": "Expired sessions",
      "example": []
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var sess = inputs.sessions,
      moment = require('moment'),
      date = moment.utc().unix(),
      sessions = inputs.sessions,
      len = sessions.length,
      i = 0,
      result = [],
      ses;


    for (i; i < len; i++) {
      ses = sessions[i]
      if (ses.expires < date) {
        result.push({
          id: ses.id
        });
      }
    }

    return exits.success(result);
  },
  "identity": "filter-expired-auth-sessions"
};