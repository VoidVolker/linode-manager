module.exports.routes = {
  "get /logout": {
    "target": "LogoutController.find"
  },
  "post /login": {
    "target": "LoginController.post_create"
  },
  "get /models": {
    "target": "ModelsController.find"
  },
  "get /adm": {
    "target": "AdmController.find"
  },
  "get /": {
    "target": "Home$Controller.find"
  },
  "get /login": {
    "target": "LoginController.get_find"
  },
  "post /resetpass": {
    "target": "ResetpassController.create"
  },
  "post /signup": {
    "target": "SignupController.create"
  }
};