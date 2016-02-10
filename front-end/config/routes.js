module.exports.routes = {
  "get /models": {
    "target": "ModelsController.find"
  },
  "post /signup": {
    "target": "SignupController.create"
  },
  "get /adm": {
    "target": "AdmController.find"
  },
  "post /login": {
    "target": "LoginController.post_create"
  },
  "get /logout": {
    "target": "LogoutController.find"
  },
  "post /resetpass": {
    "target": "ResetpassController.create"
  },
  "get /login": {
    "target": "LoginController.get_find"
  },
  "get /": {
    "target": "Home$Controller.find"
  }
};