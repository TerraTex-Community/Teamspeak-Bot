/**
 * Created by geramy on 17.02.17.
 */

const defaultConfig = require("./defaultConfig");
const fs = require("fs");
const merge = require("merge");

exports.getConfig = callback => {
    if (fs.existsSync("config.json")) {
        const configFile = require("./../config.json");
        const newConfig = merge.recursive(true, defaultConfig, configFile);
        callback(newConfig);
    } else {
        callback(defaultConfig);
    }
};
