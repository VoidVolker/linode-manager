var Machine = require("machine");
module.exports = {
    'find': function(req, res) {
        Machine.build({
            inputs: {},
            exits: {
                respond: {}
            },
            fn: function(inputs, exits) {
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
                        sails.machines['eda2a2c7-cd02-479f-a073-4baaae9acd13_1.13.0'].destroy({
                            "model": "authsession",
                            "criteria": {
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
                                // Set cookie
                                sails.machines['5bb05e6f-8a63-474b-99b6-612d0bc3977d_0.6.0'].setCookie({
                                    "name": "authsid",
                                    "value": "logout"
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
                                        return exits.respond({
                                            data: "/",
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
        }).configure(req.params.all(), {
            respond: res.response,
            error: res.negotiate
        }).exec();
    }
};