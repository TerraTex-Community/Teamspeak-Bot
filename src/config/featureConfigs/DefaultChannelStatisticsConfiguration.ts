import {IChannelStatisticsConfiguration} from "./IChannelStatisticsConfiguration";

export const defaultChannelStatisticsConfiguration : IChannelStatisticsConfiguration= {
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
};
