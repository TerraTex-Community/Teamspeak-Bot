import {tsClient} from "../../Teamspeak";
import {DbChannelStatistics} from "../../db/entity/DbChannelStatistics";
import {getConfig} from "../../config/loadConfig";
import moment = require("moment");

export class ChannelStatistics {
    channels: any = {};
    maxCounter: number = 0;
    updatedChannels: any[] = [];

    constructor() {
        setInterval(this.updateChannelEntries.bind(this), 600000);
        this.updateChannelEntries();
    }

    async updateChannelEntries() {
        this.channels = {};

        // @ts-ignore
        const rData = await tsClient.send("channellist", {}, []);

        for (const channel of rData.response) {
            this.channels[channel.cid] = {
                pid: channel.pid,
                user: channel.total_clients,
                userChilds: channel.total_clients
            };
        }
        //
        // // Calc Pids
        for (const channelId in this.channels) {
            if (!this.channels.hasOwnProperty(channelId)) {
                continue;
            }

            const channel = this.channels[channelId];
            let calcPid = channel.pid;
            while (calcPid !== 0) {
                this.channels[calcPid].userChilds += channel.user;
                calcPid = this.channels[calcPid].pid;
            }
        }
        //
        const dbPromises = [];
        const isNotEmpty = [];
        // store in DB now
        for (const channelId in this.channels) {
            if (!this.channels.hasOwnProperty(channelId)) {
                continue;
            }
            const channel = this.channels[channelId];

            const statDb = new DbChannelStatistics();
            // @ts-ignore
            statDb.channelId = channelId;
            statDb.userCount = channel.user;
            statDb.userCountWithChilds = channel.userChilds;

            if (channel.user > 0) {
                isNotEmpty.push(channelId);
            }

            dbPromises.push(statDb.save());
        }

        await Promise.all(dbPromises);
        await this.calcTeamspeakDisplays(isNotEmpty);
    }

    /**
     *
     * @param {Array} doNotEdit - Array of ChannelIds
     * @private
     */
    async calcTeamspeakDisplays(doNotEdit) {
        const showStats = {};
        for (const obj of getConfig().features.channelStatistics.showStats) {
            if (obj.timeFrame === '1d') {
                showStats[1] = {
                    txt: "Last 24 Hours: ",
                    types: obj.stats
                };
            }
            if (obj.timeFrame === '7d') {
                showStats[7] = {
                    txt: "Last 7 Days: ",
                    types: obj.stats
                };
            }
            if (obj.timeFrame === '1m') {
                showStats[30] = {
                    txt: "Last Month: ",
                    types: obj.stats
                };
            }
            if (obj.timeFrame === '3m') {
                showStats[90] = {
                    txt: "Last 3 Month: ",
                    types: obj.stats
                };
            }
            if (obj.timeFrame === 'All') {
                // 20 Years should be enough ;-)
                showStats[7300] = {
                    txt: "All Time: ",
                    types: obj.stats
                };
            }
        }

        const channelStats: any = {};

        for (const days in showStats) {
            if (showStats.hasOwnProperty(days)) {
                // @ts-ignore
                const begin = new Date(new Date().getTime() - (60 * 60 * 24 * days * 1000));
                const end = new Date();
                const selects = [
                    "channelId",
                    "MAX(userCount) AS maxUser",
                    "SUM(userCount) AS sumUser",
                    "MAX(userCountWithChilds) AS maxUserWithChilds",
                    "SUM(userCountWithChilds) AS sumUserWithChilds",
                    "COUNT(id) AS countedEntries",
                    "COUNT(CASE WHEN userCount > 0 THEN 1 ELSE NULL END) AS userEntries",
                    "COUNT(CASE WHEN userCountWithChilds > 0 THEN 1 ELSE NULL END) AS userEntriesWithChilds"
                ];

                const query = DbChannelStatistics.createQueryBuilder()
                    .select()
                    .addGroupBy("channelId")
                    .where("channelId NOT IN (:doNotEdit)", {doNotEdit})
                    .andWhere("createDate BETWEEN :begin AND :end", {begin, end})
                    .addSelect(selects)
                    .orderBy("channelId");

                const result = await query.getRawMany();

                for (const row of result) {
                    if (!channelStats[row.channelId]) {
                        channelStats[row.channelId] = {};
                    }

                    channelStats[row.channelId][days] = {
                        timeConfig: showStats[days],
                        dbData: row
                    }
                }

            }
        }

        if (!getConfig().features.channelStatistics.updateOncePerDay) {
            await this.updateAllChannelDescription(channelStats);
        } else {
            await this.updateChannelsOnce(channelStats);
        }
    }

    async updateChannelsOnce(channelStats) {
        const currentDateTime = new Date();
        if (currentDateTime.getHours() === 0 && currentDateTime.getMinutes() < 30) {
            this.maxCounter = 0;
            this.updatedChannels = [];
        }

        const splittedTime = getConfig().features.channelStatistics.updateChannelStartTime.split(":");
        if (splittedTime.length === 1) {
            // @ts-ignore
            splittedTime[1] = 0;
        }

        // @ts-ignore
        const nextStartDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), splittedTime[0], splittedTime[1]);

        if (nextStartDate.getTime() < currentDateTime.getTime()) {
            this.maxCounter = 0;
            for (const channelId in channelStats) {
                if (channelStats.hasOwnProperty(channelId) && this.updatedChannels.indexOf(channelId) === -1) {
                    await this.updateChannelDescription(channelId, channelStats[channelId]);

                    this.updatedChannels.push(channelId);
                    this.maxCounter++;
                    if (this.maxCounter !== -1 && this.maxCounter > getConfig().features.channelStatistics.updateMaxChannelsPerLoop) {
                        break;
                    }
                }
            }
        }
    }

    async updateAllChannelDescription(channelStats) {
        // channeledit cid=15 channel_codec_quality=3 channel_description=My\sDescription
        for (const channelId in channelStats) {
            if (channelStats.hasOwnProperty(channelId)) {
                try {
                    await this.updateChannelDescription(channelId, channelStats[channelId]);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    async updateChannelDescription(channelId, channelStats) {
        const descriptionRegExp = /\[DbChannelStatistics\](?:.|\n)*\/DbChannelStatistics\]/gm;

        const tsChannelData = (await tsClient.send("channelinfo", {cid: channelId}))
            .response[0];

        if (tsChannelData.channel_flag_permanent === 0) {
            await DbChannelStatistics.delete({
                channelId
            });

            console.info("Removed Channel " + channelId + " from Channelstatistics, Reason: not permanent.");

            return;
        }

        let description = tsChannelData.channel_description;
        const regResult = description.match(descriptionRegExp);

        const newContent = await this.getNewChannelContent(channelStats);

        if (regResult && regResult.length > 0) {
            description = description.replace(descriptionRegExp, newContent);
        } else {
            description += ('\n\n' + newContent);
        }

        await tsClient.send("channeledit", {
            cid: channelId,
            channel_description: description
        }, []);

        return;
    }

    async getNewChannelContent(channelStats) {
        let newContent = "[DbChannelStatistics]\n";
        newContent += "Last Statistics Update: " + moment().format('MMMM Do YYYY, HH:mm:ss') + "\n";

        for (const days in channelStats) {
            if (channelStats.hasOwnProperty(days)) {
                const timeData = channelStats[days].dbData;
                const timeConfig = channelStats[days].timeConfig;

                let line = timeConfig.txt;
                const lineArray = [];

                if (getConfig().features.channelStatistics.countTreeTogether) {
                    if (timeConfig.types.indexOf('avg') !== -1) {
                        lineArray.push('Avg: ' + (Math.round(timeData.sumUserWithChilds / timeData.countedEntries * 100) / 100));
                    }

                    if (timeConfig.types.indexOf('max') !== -1) {
                        lineArray.push('Max: ' + timeData.maxUserWithChilds);
                    }

                    if (timeConfig.types.indexOf('usage') !== -1) {
                        lineArray.push('Usage: ' + (Math.round(timeData.userEntriesWithChilds / timeData.countedEntries * 10000) / 100) + '%');
                    }
                } else {
                    if (timeConfig.types.indexOf('avg') !== -1) {
                        lineArray.push('Avg: ' + (Math.round(timeData.sumUser / timeData.countedEntries * 100) / 100));
                    }

                    if (timeConfig.types.indexOf('max') !== -1) {
                        lineArray.push('Max: ' + timeData.maxUser);
                    }

                    if (timeConfig.types.indexOf('usage') !== -1) {
                        lineArray.push('Usage: ' + (Math.round(timeData.userEntries / timeData.countedEntries * 10000) / 100) + '%');
                    }
                }

                line += lineArray.join(' - ');
                line += '\n';
                newContent += line;
            }
        }

        newContent += "[/DbChannelStatistics]";

        return newContent;
    }
}
