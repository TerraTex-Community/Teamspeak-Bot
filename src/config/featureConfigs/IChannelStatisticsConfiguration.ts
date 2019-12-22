
export interface IChannelStatisticsConfiguration {
    enabled: boolean,

    /**
     * defaultTag: "Channel-Statistiken",  -> Not Used For Now
     * types: max, avg, usage  (max: maximal Usernumber, avg: Average Usernumber,
     *                          usage: Percentage: UsedTime/TotalTime)
     * times: 1d, 7d, 1m, 3m, All
     */
    showStats: StatsOptions[],
    countTreeTogether: boolean,
    /**
     * will channel not update on each loop
     */
    updateOncePerDay: boolean,
    /**
     * if updateOncePerDay = true this is mandatory to set which time the update will start.
     * Attention: Using a Time between 0:00 and 1:00 will cause errors
     */
    updateChannelStartTime: string,

    /**
     * updateMaxChannelsPerLoop is the maximum number of updated channel describtions per loop
     */
    updateMaxChannelsPerLoop: number
}

export interface StatsOptions {
    timeFrame: string,
    stats: string[]
}
