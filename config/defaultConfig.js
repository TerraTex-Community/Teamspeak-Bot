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
            // defaultTag: "Channel-Statistiken",  -> Not Used For Now
            // types: max, avg, usage  (max: maximal Usernumber, avg: Average Usernumber, usage: Percentage: UsedTime/TotalTime
            // times: 1d, 7d, 1m, 3m, All
            showStats: [
                {
                    timeFrame: "1d",
                    stats: ["max", "usage", "avg"]
                },
                {
                    timeFrame: "7d",
                    stats: ["usage"]
                },
                {
                    timeFrame: "1m",
                    stats: ["usage"]
                },
                {
                    timeFrame: "3m",
                    stats: ["usage"]
                }
            ],
            countTreeTogether: true,
            // will channel not update on each loop
            updateOncePerDay: true,
            // if updateOncePerDay = true this is mandatory to set which time the update will start. Attention: Using a Time between 0:00 and 1:00 will cause errors
            updateChannelStartTime: "1:00",
            // updateMaxChannelsPerLoop is the maximum number of updated channel describtions per loop
            updateMaxChannelsPerLoop: 25
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