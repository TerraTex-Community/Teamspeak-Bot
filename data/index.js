/**
 * Created by C5217649 on 17.02.2017.
 */
const Database = require("./database");

exports.startUpDatabase = callback => {
    global.gDatabase = new Database();
    gDatabase.authenticate(err => {
        if (err) {
            callback(err);
        } else {
            gDatabase.loadModels(err => {
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
            })
        }
    });
};