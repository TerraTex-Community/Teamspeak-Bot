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

        data.startUpTeamspeak(tErr => {
            if (tErr) {
                throw new Error(tErr.error_id + ": " + tErr.message);
            }

            //start up done
            //require feature systems
            require("./features/index");
        });
    });
});
