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
      "friendlyName": "criteria",
      "description": "Criteria array",
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
      "description": "Normal outcome.",
      "void": true
    }
  },
  "sync": false,
  "cacheable": false,
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var model = env.sails.models[inputs.model],
      criteria = inputs.criteria,
      i = 0,
      len = criteria.length;

    function iterator(err, records) {
      //console.log('records:', records);
    }


    if (model === undefined) {
      return exits.error('Model destroy arr: env.sails.models.' + inputs.model + ' is undefined');
    } else {
      for (i; i < len; i++) {
        //console.log('destroy:', criteria[i]);
        model.destroy(criteria[i], {}).exec(iterator);
      }
      return exits.success();
    }
  },
  "identity": "destroy-arr"
};