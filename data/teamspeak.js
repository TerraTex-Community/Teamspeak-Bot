/**
 * Created by C5217649 on 17.02.2017.
 */
const Ts = require("node-teamspeak-api");

class Teamspeak {
    constructor() {
        this._client = new Ts(gConfig.teamspeakIp, gConfig.queryPort);
    }

    connect(callback) {
        this._client.api.login({
            client_login_name: gConfig.username,
            client_login_password: gConfig.password
        }, err => {
            if (err) {
                return callback(err);
            }
            this._client.api.use({
                sid: gConfig.tsServerId
            }, uerr => {
                if (uerr) {
                    return callback(uerr);
                }
                return callback();
            });
        });
    }
}
module.exports = Teamspeak;