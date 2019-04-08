import {existsSync, promises} from "fs";
import * as deepmerge from 'deepmerge'
import {defaultConfig} from "./defaultConfig";

let config: Config;

export async function loadConfig() {
    if (existsSync("config.json")) {
        const loadedFile = JSON.parse((await promises.readFile("config.json")).toString());

        // @ts-ignore
        config = deepmerge(defaultConfig, loadedFile, {
            arrayMerge: (destinationArray, sourceArray) => sourceArray
        });
    }
}

export function getConfig(): Config {
    return config;
}

interface Config {
    teamspeakIp: string,
    queryPort: number,
    tsServerId: number,
    username: string,
    password: string,
    features: FeatureConfiguration

}

interface FeatureConfiguration {
    channelStatistics: ChannelStatisticsConfiguration,
    registration: RegistrationConfiguration
    welcomeMessage: {enabled: boolean, message: string}
}

interface ChannelStatisticsConfiguration {
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

interface StatsOptions {
    timeFrame: string,
    stats: string[]
}

interface RegistrationConfiguration {
    enabled: boolean,
    /**
     * enable automatic group registration
     */
    automatic: boolean,
    /**
     *  set group after [automaticAfterConnectTime] Minutes connection time  (0 or lower will directly set group)
     */
    automaticAfterConnectTime: number,
    /**
     * groupId that should be set
     */
    groupId: number,
    /**
     * set only once or everytime user has not this group
     */
    onlyOnce: boolean
}
