module.exports = {
  "inputs": {
    "model": {
      "friendlyName": "model",
      "description": "Model name",
      "example": "",
      "addedManually": true,
      "requiredManually": true,
      "required": true
    },
    "fields": {
      "id": "74f5c566-4158-443f-9d32-a9eaae2fdb2d",
      "friendlyName": "fields",
      "description": "Data fields of model",
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
      "example": {}
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var model = env.sails.models[inputs.model];
    if (model === undefined) {
      return exits.error('Model create: env.sails.models.' + inputs.model + ' is undefined');
    } else {
      model.create(env.sails.util.objCompact(inputs.fields)).exec(function(err, records) {
        if (err) {
          return exits.error(err);
        }
        return exits.success(records);
      });
    }
  },
  "identity": "create"
};