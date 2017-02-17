/**
 * Created by geramy on 17.02.17.
 */

module.exports = {
    teamspeakIp: "127.0.0.1",
    // on Terratex: 20000
    queryPort: 10011,
    tsServerId: 1,
    username: null,
    password: null,

    features: {
        channelStatistics: {
            enabled: true,
            defaultTag: "Channel-Statistiken",
            // possible stats: max24h, avg24h, max7d, avg7d, max6m, avg6m, max3m, avg3m
            showStats: ["max24h", "avg24h", "max7d", "avg7d"]
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