/**
 * Created by geramy on 17.02.17.
 */

// startup process
const loadConfig = require("./config/loadConfig").getConfig;
const data = require("./data/index");

loadConfig((config) => {
    global.gConfig = config;

    data.startUpDatabase(err => {
        if (err) {
            throw err;
        }


    });
});