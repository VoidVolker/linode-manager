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
      "id": "b9b1ef7e-4bfe-44e3-a3fe-1e785f1e81e5",
      "friendlyName": "criteria",
      "description": "Waterline search criteria to use in retrieving User instances",
      "example": {},
      "defaultsTo": {},
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
      "example": [{}]
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var model = env.sails.models[inputs.model];
    if (model === undefined) {
      return exits.error('Model destroy: env.sails.models.' + inputs.model + ' is undefined');
    } else {
      model.destroy(inputs.criteria, {}).exec(function(err, records) {
        if (err) {
          return exits.error(err);
        }
        return exits.success(records);
      });
    }
  },
  "identity": "destroy"
};