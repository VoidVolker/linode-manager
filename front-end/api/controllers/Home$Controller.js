var Machine = require("machine");
module.exports = {
    'find': function(req, res) {
        Machine.build({
            inputs: {},
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
                        sails.machines['eda2a2c7-cd02-479f-a073-4baaae9acd13_1.13.0'].findOne({
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
                                        return exits.respond({
                                            data: null,
                                            action: "display_view",
                                            status: 200,
                                            view: "homepage"
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
                                            data: null,
                                            action: "display_view",
                                            status: 500,
                                            view: "login"
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
                                    data: null,
                                    action: "display_view",
                                    status: 500,
                                    view: "login"
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