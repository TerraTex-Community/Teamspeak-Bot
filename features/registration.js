/**
 * Created by C5217649 on 03.05.2017.
 */

class RegistrationSystem {
    constructor() {
        //@todo #3 Register Command

        if (gConfig.features.registration.automatic) {
            gTeamspeak.client.subscribe({
                event: 'server'
            });

            gTeamspeak.client.on('notify.cliententerview', (eventName, resp) => {
                this._onUserJoin(eventName, resp);
            });
        }
    }

    _onUserJoin(eventName, resp) {
        const findOrCreate = gDatabase.tableUser.findOrCreate({
            where: {
                UniqueId: resp.client_unique_identifier
            },
            defaults: {
                UniqueId: resp.client_unique_identifier,
                Registered: 0,
                LastNickname: resp.client_nickname,
                LastLogin: new Date()
            }
        });
        findOrCreate.catch(err => console.error(err)).then(() => {
            gDatabase.tableUser.update({
                LastNickname: resp.client_nickname,
                LastLogin: new Date()
            }, {
                where: {
                    UniqueId: resp.client_unique_identifier
                }
            });

            if (gConfig.features.registration.automaticAfterConnectTime > 0) {
                setTimeout(
                    this._checkRegisterUpdate.bind(this),
                    (gConfig.features.registration.automaticAfterConnectTime * 60000 + 10000),
                    resp.clid,
                    resp.client_unique_identifier
                );
            } else {
                this._checkRegisterUpdate(resp.clid, resp.client_unique_identifier);
            }
        });
    }

    _checkRegisterUpdate(clientId, uniqueId) {
        gTeamspeak.client.send("clientinfo", {clid: clientId}, (err, resp) => {
            if (!err && resp) {
                const connectedTime = Math.round((new Date()).getTime() / 1000) - resp.data.client_lastconnected + 10;
                // if connected time is smaller it means there was a reconnect during that time
                if (connectedTime > gConfig.features.registration.automaticAfterConnectTime) {
                    if (resp.data.client_nickname !== "TeamSpeakUser") {
                        const getUser = gDatabase.tableUser.findAll({
                            where: {
                                UniqueId: uniqueId
                            }
                        });
                        getUser.catch(pErr => console.error(pErr)).then(data => {
                            if (!data[0].dataValues.Registered || !gConfig.features.registration.onlyOnce) {
                                this._setGroup(resp.data.client_database_id, uniqueId);
                            }
                        });
                    } else {
                        setTimeout(
                            this._checkRegisterUpdate.bind(this),
                            300000,
                            resp.clid,
                            resp.client_unique_identifier
                        );
                    }
                }
            }
        });
    }

    _setGroup(cldbid, uniqueId) {
        gTeamspeak.client.send("servergroupaddclient", {
            cldbid: cldbid,
            sgid: gConfig.features.registration.groupId
        }, (err) => {
            if (!err || err.error_id === 2561) {
                gDatabase.tableUser.update({
                    Registered: true
                }, {
                    where: {
                        UniqueId: uniqueId
                    }
                });
            } else {
                console.error(err.message);
            }
        });
    }
}
const classInstance = new RegistrationSystem();
module.exports = classInstance;