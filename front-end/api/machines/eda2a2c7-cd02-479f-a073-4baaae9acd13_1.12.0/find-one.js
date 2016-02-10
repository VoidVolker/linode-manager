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
      "id": "3483eecf-7b82-4ac4-9f6b-2facd6b35a72",
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
      "example": {}
    },
    "notFound": {
      "id": "519cbd5d-ea6b-4126-be1f-47c6b78daf34",
      "friendlyName": "notFound",
      "description": "",
      "void": true
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var model = env.sails.models[inputs.model];
    if (model === undefined) {
      return exits.error('Model find one: env.sails.models.' + inputs.model + ' is undefined');
    } else {
      model.findOne(inputs.criteria, {}).exec(function(err, record) {
        if (err) {
          return exits.error(err);
        }
        if (!record) {
          return exits.notFound();
        }
        return exits.success(record);
      });
    }
  },
  "identity": "find-one"
};