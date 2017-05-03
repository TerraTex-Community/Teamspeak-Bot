/**
 * Created by C5217649 on 17.02.2017.
 */
const Database = require("./database");
const Teamspeak = require("./teamspeak");

exports.startUpDatabase = callback => {
    global.gDatabase = new Database();
    gDatabase.authenticate(err => {
        if (err) {
            callback(err);
        } else {
            gDatabase.loadModels(mErr => {
                if (mErr) {
                    callback(mErr);
                } else {
                    callback();
                }
            });
        }
    });
};

exports.startUpTeamspeak = callback => {
    global.gTeamspeak = new Teamspeak();
    gTeamspeak.connect(callback);
};