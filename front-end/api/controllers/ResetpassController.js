var Machine = require("machine");
module.exports = {
    'create': function(req, res) {
        Machine.build({
            inputs: {
                "id": {
                    "example": 123,
                    "required": true
                },
                "password": {
                    "example": "password",
                    "required": true
                },
                "redirect": {
                    "example": "index"
                }
            },
            exits: {
                respond: {}
            },
            fn: function(inputs, exits) {
                // Try get cookie
                sails.machines['5bb05e6f-8a63-474b-99b6-612d0bc3977d_0.6.0'].tryGetCookie({
                    "Name": "authsid"
                }).setEnvironment({
                    req: req
                }).exec({
                    "error": function(tryGetCookie) {
                        return exits.error({
                            data: tryGetCookie,
                            status: 500
                        });

                    },
                    "success": function(tryGetCookie) {
                        // Find One Session by SID
                        sails.machines['eda2a2c7-cd02-479f-a073-4baaae9acd13_1.12.0'].findOne({
                            "model": "authsession",
                            "criteria": {
                                sid: tryGetCookie
                            }
                        }).setEnvironment({
                            sails: sails
                        }).exec({
                            "error": function(findOneSessionBySID) {
                                return exits.error({
                                    data: findOneSessionBySID,
                                    status: 500
                                });

                            },
                            "success": function(findOneSessionBySID) {
                                // Return Boolean
                                sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.3.0'].returnBoolean({
                                    "boolean": true
                                }).exec({
                                    "error": function(returnBoolean) {
                                        return exits.error({
                                            data: returnBoolean,
                                            status: 500
                                        });

                                    },
                                    "success": function(returnBoolean) {
                                        // Find One
                                        sails.machines['eda2a2c7-cd02-479f-a073-4baaae9acd13_1.12.0'].findOne({
                                            "model": "user",
                                            "criteria": {
                                                id: inputs.id
                                            }
                                        }).setEnvironment({
                                            sails: sails
                                        }).exec({
                                            "error": function(findOne) {
                                                return exits.error({
                                                    data: findOne,
                                                    status: 500
                                                });

                                            },
                                            "success": function(findOne) {
                                                // Return User
                                                sails.machines['2b8be9ac-23ca-43be-bb41-8540b8aebed5_4.1.3'].returnUser({
                                                    "user": findOne
                                                }).exec({
                                                    "error": function(returnUser) {
                                                        return exits.error({
                                                            data: returnUser,
                                                            status: 500
                                                        });

                                                    },
                                                    "success": function(returnUser) {
                                                        // Encrypt password
                                                        sails.machines['e05a71f7-485d-443a-803e-029b84fe73a4_2.3.0'].encryptPassword({
                                                            "password": inputs.password
                                                        }).exec({
                                                            "error": function(encryptPassword) {
                                                                return exits.error({
                                                                    data: encryptPassword,
                                                                    status: 500
                                                                });

                                                            },
                                                            "success": function(encryptPassword) {
                                                                // Update
                                                                sails.machines['eda2a2c7-cd02-479f-a073-4baaae9acd13_1.12.0'].update({
                                                                    "model": "user",
                                                                    "criteria": {
                                                                        id: (returnUser && returnUser.id)
                                                                    },
                                                                    "fields": {
                                                                        password: encryptPassword
                                                                    }
                                                                }).setEnvironment({
                                                                    sails: sails
                                                                }).exec({
                                                                    "error": function(update) {
                                                                        return exits.error({
                                                                            data: update,
                                                                            status: 500
                                                                        });

                                                                    },
                                                                    "success": function(update) {
                                                                        // Get redirect
                                                                        sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.1.1'].returnString({
                                                                            "string": inputs.redirect
                                                                        }).exec({
                                                                            "error": function(getRedirect) {
                                                                                return exits.error({
                                                                                    data: getRedirect,
                                                                                    status: 500
                                                                                });

                                                                            },
                                                                            "success": function(getRedirect) {
                                                                                return exits.respond({
                                                                                    data: "/" + getRedirect,
                                                                                    action: "redirect",
                                                                                    status: 200
                                                                                });

                                                                            }
                                                                        });

                                                                    }
                                                                });

                                                            }
                                                        });

                                                    }
                                                });

                                            },
                                            "notFound": function(findOne) {
                                                return exits.error({
                                                    data: findOne,
                                                    status: 200
                                                });

                                            }
                                        });

                                    }
                                });

                            },
                            "notFound": function(findOneSessionBySID) {
                                // Not logged 2
                                sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.3.0'].returnBoolean({
                                    "boolean": false
                                }).exec({
                                    "error": function(notLogged2) {
                                        return exits.error({
                                            data: notLogged2,
                                            status: 500
                                        });

                                    },
                                    "success": function(notLogged2) {
                                        return exits.respond({
                                            action: "respond_with_status",
                                            status: "404"
                                        });

                                    }
                                });

                            }
                        });

                    },
                    "NotFound": function(tryGetCookie) {
                        // Not logged
                        sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.3.0'].returnBoolean({
                            "boolean": false
                        }).exec({
                            "error": function(notLogged) {
                                return exits.error({
                                    data: notLogged,
                                    status: 500
                                });

                            },
                            "success": function(notLogged) {
                                return exits.respond({
                                    action: "respond_with_status",
                                    status: "404"
                                });

                            }
                        });

                    }
                });
            }
        }).configure(req.params.all(), {
            respond: res.response,
            error: res.negotiate
        }).exec();
    }
};