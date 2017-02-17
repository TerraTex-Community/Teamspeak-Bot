/**
 * Created by geramy on 17.02.17.
 */

// startup process
const loadConfig = require("./config/loadConfig").getConfig;
const Database = require("./data/database");

loadConfig((config) => {
    global.gConfig = config;
    console.log(config);

    global.gDatabase = new Database();
    gDatabase.authenticate();
});