var Machine = require("machine");
module.exports = {
    'post_create': function(req, res) {
        Machine.build({
            inputs: {
                "login": {
                    "example": "Alice",
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
                // Find One User
                sails.machines['eda2a2c7-cd02-479f-a073-4baaae9acd13_1.12.0'].findOne({
                    "model": "user",
                    "criteria": {
                        login: inputs.login
                    }
                }).setEnvironment({
                    sails: sails
                }).exec({
                    "error": function(findOneUser) {
                        return exits.error({
                            data: findOneUser,
                            status: 500
                        });

                    },
                    "success": function(findOneUser) {
                        // Return User
                        sails.machines['2b8be9ac-23ca-43be-bb41-8540b8aebed5_4.1.3'].returnUser({
                            "user": findOneUser
                        }).exec({
                            "error": function(returnUser) {
                                return exits.error({
                                    data: returnUser,
                                    status: 500
                                });

                            },
                            "success": function(returnUser) {
                                // Check password
                                sails.machines['e05a71f7-485d-443a-803e-029b84fe73a4_2.3.0'].checkPassword({
                                    "passwordAttempt": inputs.password,
                                    "encryptedPassword": (returnUser && returnUser.password)
                                }).exec({
                                    "error": function(checkPassword) {
                                        return exits.error({
                                            data: checkPassword,
                                            status: 500
                                        });

                                    },
                                    "incorrect": function(checkPassword) {
                                        // Return Error
                                        sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.3.0'].returnError({
                                            "msg": "Wrong password"
                                        }).exec({
                                            "error": function(returnError) {
                                                return exits.error({
                                                    data: returnError,
                                                    status: 500
                                                });

                                            },
                                            "success": function(returnError) {
                                                return exits.respond({
                                                    data: null,
                                                    action: "display_view",
                                                    status: 500,
                                                    view: "wrongLogin"
                                                });

                                            }
                                        });

                                    },
                                    "success": function(checkPassword) {
                                        // Get cookie
                                        sails.machines['5bb05e6f-8a63-474b-99b6-612d0bc3977d_0.6.0'].getCookie({
                                            "Name": "authsid"
                                        }).setEnvironment({
                                            req: req
                                        }).exec({
                                            "error": function(getCookie) {
                                                return exits.error({
                                                    data: getCookie,
                                                    status: 500
                                                });

                                            },
                                            "success": function(getCookie) {
                                                // Destroy
                                                sails.machines['eda2a2c7-cd02-479f-a073-4baaae9acd13_1.12.0'].destroy({
                                                    "model": "authsession",
                                                    "criteria": {
                                                        userid: (returnUser && returnUser.id),
                                                        sid: getCookie
                                                    }
                                                }).setEnvironment({
                                                    sails: sails
                                                }).exec({
                                                    "error": function(destroy) {
                                                        return exits.error({
                                                            data: destroy,
                                                            status: 500
                                                        });

                                                    },
                                                    "success": function(destroy) {
                                                        // New sid
                                                        sails.machines['2b8be9ac-23ca-43be-bb41-8540b8aebed5_4.1.3'].newSid({}).exec({
                                                            "error": function(newSid) {
                                                                return exits.error({
                                                                    data: newSid,
                                                                    status: 500
                                                                });

                                                            },
                                                            "success": function(newSid) {
                                                                // Unix time offset
                                                                sails.machines['2b8be9ac-23ca-43be-bb41-8540b8aebed5_4.1.3'].dateString({
                                                                    "offset": 1,
                                                                    "type": "M"
                                                                }).exec({
                                                                    "error": function(unixTimeOffset) {
                                                                        return exits.error({
                                                                            data: unixTimeOffset,
                                                                            status: 500
                                                                        });

                                                                    },
                                                                    "success": function(unixTimeOffset) {
                                                                        // Create session
                                                                        sails.machines['eda2a2c7-cd02-479f-a073-4baaae9acd13_1.12.0'].create({
                                                                            "model": "authsession",
                                                                            "fields": {
                                                                                sid: newSid,
                                                                                userid: (returnUser && returnUser.id),
                                                                                expires: unixTimeOffset
                                                                            }
                                                                        }).setEnvironment({
                                                                            sails: sails
                                                                        }).exec({
                                                                            "error": function(createSession) {
                                                                                return exits.error({
                                                                                    data: createSession,
                                                                                    status: 500
                                                                                });

                                                                            },
                                                                            "success": function(createSession) {
                                                                                // Set cookie
                                                                                sails.machines['5bb05e6f-8a63-474b-99b6-612d0bc3977d_0.6.0'].setCookie({
                                                                                    "name": "authsid",
                                                                                    "value": newSid,
                                                                                    "expires": 1,
                                                                                    "type": "M"
                                                                                }).setEnvironment({
                                                                                    res: res
                                                                                }).exec({
                                                                                    "error": function(setCookie) {
                                                                                        return exits.error({
                                                                                            data: setCookie,
                                                                                            status: 500
                                                                                        });

                                                                                    },
                                                                                    "success": function(setCookie) {
                                                                                        // Return String
                                                                                        sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.3.0'].returnString({
                                                                                            "string": newSid
                                                                                        }).exec({
                                                                                            "error": function(returnString2) {
                                                                                                return exits.error({
                                                                                                    data: returnString2,
                                                                                                    status: 500
                                                                                                });

                                                                                            },
                                                                                            "success": function(returnString2) {
                                                                                                // Noop
                                                                                                sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.3.0'].noop({}).exec({
                                                                                                    "error": function(noop) {
                                                                                                        return exits.error({
                                                                                                            data: noop,
                                                                                                            status: 500
                                                                                                        });

                                                                                                    },
                                                                                                    "success": function(noop) {
                                                                                                        // Return String
                                                                                                        sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.1.1'].returnString({
                                                                                                            "string": inputs.redirect
                                                                                                        }).exec({
                                                                                                            "error": function(returnString) {
                                                                                                                return exits.error({
                                                                                                                    data: returnString,
                                                                                                                    status: 500
                                                                                                                });

                                                                                                            },
                                                                                                            "success": function(returnString) {
                                                                                                                return exits.respond({
                                                                                                                    data: "/" + returnString,
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

                                                                            }
                                                                        });

                                                                    }
                                                                });

                                                            }
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
                    "notFound": function(findOneUser) {
                        // Return Error
                        sails.machines['2e6c2f60-6d69-4c41-851f-5c586760aee8_1.3.0'].returnError({
                            "msg": "Wrong login"
                        }).exec({
                            "error": function(returnError2) {
                                return exits.error({
                                    data: returnError2,
                                    status: 500
                                });

                            },
                            "success": function(returnError2) {
                                return exits.respond({
                                    data: null,
                                    action: "display_view",
                                    status: 500,
                                    view: "wrongLogin"
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
    },
    'get_find': function(req, res) {
        Machine.build({
            inputs: {},
            exits: {
                respond: {}
            },
            fn: function(inputs, exits) {
                return exits.respond({
                    action: "display_view",
                    status: 200,
                    view: "login",
                    data: undefined
                });
            }
        }).configure(req.params.all(), {
            respond: res.response,
            error: res.negotiate
        }).exec();
    }
};