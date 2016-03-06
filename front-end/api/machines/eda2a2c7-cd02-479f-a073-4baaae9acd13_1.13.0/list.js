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
    "limit": {
      "id": "226b04d7-2e06-4740-8cad-fdcf75838575",
      "friendlyName": "limit",
      "description": "The maximum number of records to return",
      "example": 123,
      "addedManually": true
    },
    "skip": {
      "id": "a9b12480-59f1-4ba3-b3fc-0cc6c03ea847",
      "friendlyName": "skip",
      "description": "The number of records to skip in the result",
      "example": 123,
      "addedManually": true
    },
    "sort": {
      "id": "a1591a4d-adc1-49b5-848b-72cd0869111b",
      "friendlyName": "sort",
      "description": "Sort options for results, as a dictionary where the keys are attribute names and values are 1 (ascending) or 0 (descending)",
      "example": "a string",
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
    var model = env.sails.models[inputs.model],
      query;
    if (model === undefined) {
      return exits.error('Model list: env.sails.models.' + inputs.model + ' is undefined');
    } else {
      query = model.find(env.sails.util.objCompact(inputs.criteria));
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
    }
  },
  "identity": "list"
};