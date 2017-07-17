/**
 * Created by C5217649 on 17.02.2017.
 */
const Ts = require("node-teamspeak-api");

class Teamspeak {
    constructor() {
        /**
         *
         * @type {TeamSpeak}
         * @private
         */
        this._client = new Ts(gConfig.teamspeakIp, gConfig.queryPort);
        this._addErrorHandler();
    }

    _addErrorHandler() {
        this._client.on('error', error => {
            console.error(error);
            this._client.connect();
        });
        this._client.on('close', () => {
            this.connect();
        });
        this._client.on('timeout', () => {
            this._client.disconnect();
            this.connect();
        });
    }

    _keepConnectionAlive() {
        this._client.send("whoami", () => {
            console.info("Sended a whoami ping");
        });
    }

    connect(callback) {
        this._client.api.login({
            client_login_name: gConfig.username,
            client_login_password: gConfig.password
        }, err => {
            if (err) {
                return callback(err);
            }
            return this._client.api.use({
                sid: gConfig.tsServerId
            }, uErr => {
                if (uErr) {
                    return callback(uErr);
                }
                return this._readMyData(callback);
            });
        });
    }

    _readMyData(callback) {
        this._client.send("whoami", (err, resp) => {
            this._data = resp.data;
            setInterval(this._keepConnectionAlive.bind(this), 300000);
            callback();
        });
    }

    /**
     *
     * @returns {TeamSpeak}
     */
    get client() {
        return this._client;
    }

    get myData() {
        return this._data;
    }
}
module.exports = Teamspeak;
