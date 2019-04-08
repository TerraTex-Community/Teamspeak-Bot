export let defaultConfig = {
    teamspeakIp: "127.0.0.1",
    // on Terratex: 20000
    queryPort: 10011,
    tsServerId: 1,
    username: null,
    password: null,

    features: {
        welcomeMessage: {
            enabled: true,
            message: "Willkommen auf dem Teamspeak. Mich erreichst du unter !bot"
        },
        channelStatistics: {
            enabled: true,
            // defaultTag: "Channel-Statistiken",  -> Not Used For Now
            // types: max, avg, usage  (max: maximal Usernumber, avg: Average Usernumber,
            //                          usage: Percentage: UsedTime/TotalTime)
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
            // if updateOncePerDay = true this is mandatory to set which time the update will start.
            // Attention: Using a Time between 0:00 and 1:00 will cause errors
            updateChannelStartTime: "1:00",
            // updateMaxChannelsPerLoop is the maximum number of updated channel describtions per loop
            updateMaxChannelsPerLoop: 25
        },
        registration: {
            // should registration feature enabled
            enabled: true,
            // enable automatic group registration
            automatic: true,
            // set group after [automaticAfterConnectTime] Minutes connection time  (0 or lower will directly set group)
            automaticAfterConnectTime: 10,
            // groupId that should be set
            groupId: 0,
            // set only once or everytime user has not this group
            onlyOnce: true
        }
    }
};



