/**
 * Created by geramy on 17.02.17.
 */

// startup process
const loadConfig = require("./config/loadConfig").getConfig;

loadConfig((config) => {
    global.gConfig = config;
    console.log(config);
});