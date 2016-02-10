module.exports = {
  "inputs": {
    "model": {
      "friendlyName": "model",
      "description": "Model name",
      "example": "user",
      "addedManually": true,
      "requiredManually": true,
      "required": true
    },
    "criteria": {
      "id": "fe26ceb0-ade3-40f7-b43a-ad03ce0094c3",
      "friendlyName": "criteria",
      "description": "Waterline search criteria to use in retrieving User instances",
      "example": {},
      "defaultsTo": {},
      "addedManually": true
    },
    "fields": {
      "friendlyName": "fields",
      "description": "Model fields to search",
      "example": {},
      "addedManually": true
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
      "example": []
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var model = env.sails.models[inputs.model];
    if (model === undefined) {
      return exits.error('Model update: env.sails.models.' + inputs.model + ' is undefined');
    } else {
      model.update(inputs.criteria, env.sails.util.objCompact(inputs.fields)).exec(function(err, records) {
        if (err) {
          return exits.error(err);
        }
        return exits.success(records);
      });
    }
  },
  "identity": "update"
};