/**
 * Created by geramy on 17.02.17.
 */

module.exports = {
    teamspeakIp: "127.0.0.1",
    queryPort: 20000,
    username: null,
    password: null,
    features: {
        channelStatistics: {
            enabled: true
        }
    },
    database: {
        // only sqlite and mysql are supported
        type: "sqlite",
        database: "teamspeak_bot",
        // for sqlite
        storage: 'storage.db',

        // for mysql
        host: 'localhost',
        user: null,
        password: null
    }
};