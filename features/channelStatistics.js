/**
 * Created by geramy on 20.02.17.
 */
const sequelize = require("sequelize");
const merge = require("merge");
const moment = require("moment");

class ChannelStatistics {
    constructor() {
        this._channels = {};
        setInterval(this.updateChannelEntries.bind(this), 600000);
        this._maxCounter = 0;
        this._updatedChannels = [];
    }

    updateChannelEntries() {
        this._channels = {};

        gTeamspeak.client.send("channellist", (err, resp) => {
            if (err) {
                return console.error(err);
            }

            for (const channel of resp.data) {
                this._channels[channel.cid] = {
                    pid: channel.pid,
                    user: channel.total_clients,
                    userChilds: channel.total_clients
                };
            }

            // Calc Pids
            for (const channelId in this._channels) {
                if (!this._channels.hasOwnProperty(channelId)) {
                    continue;
                }

                const channel = this._channels[channelId];
                let calcPid = channel.pid;
                while (calcPid !== 0) {
                    this._channels[calcPid].userChilds += channel.user;
                    calcPid = this._channels[calcPid].pid;
                }
            }

            const dbPromises = [];
            const isNotEmpty = [];
            // store in DB now
            for (const channelId in this._channels) {
                if (!this._channels.hasOwnProperty(channelId)) {
                    continue;
                }
                const channel = this._channels[channelId];

                dbPromises.push(gDatabase.tableChannelStatistics.create({
                    ChannelID: channelId,
                    UserCount: channel.user,
                    UserCountWithChilds: channel.userChilds
                }));

                if (channel.user > 0) {
                    isNotEmpty.push(channelId);
                }
            }

            Promise.all(dbPromises).then(() => {
                //calc display to Teamspeak
                this._calcTeamspeakDisplays(isNotEmpty);
            }).catch(errs => {
                console.error(errs);
            });
        });
    }

    /**
     *
     * @param {Array} doNotEdit - Array of ChannelIds
     * @private
     */
    _calcTeamspeakDisplays(doNotEdit) {
        const showStats = {};
        for (const obj of gConfig.features.channelStatistics.showStats) {
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

        const allPromises = [];
        for (const days in showStats) {
            if (showStats.hasOwnProperty(days)) {
                const promise = this._generateStatsQuery(doNotEdit, days);
                allPromises.push(promise.then(this._reformatStatsResult).catch(err => console.error(err)));
            }
        }

        Promise.all(allPromises).then(values => {
            values.unshift(true);
            const result = merge.recursive.apply(this, values);
            if (!gConfig.features.channelStatistics.updateOncePerDay) {
                this._updateAllChannelDescription(showStats, result);
            } else {
                this._updateChannelsOnce(showStats, result);
            }
        });
    }

    _reformatStatsResult(data) {
        const result = {};
        for (const values of data) {
            const channel = values.dataValues;
            result[channel.ChannelID] = {[days]: values.dataValues};
        }

        return result;
    }

    _updateChannelsOnce(timeDefinitions, dbResults) {
        const currentDateTime = new Date();
        if (currentDateTime.getHours() === 0 && currentDateTime.getMinutes() < 30) {
            this._maxCounter = 0;
            this._updatedChannels = [];
        }

        const splittedTime = gConfig.features.channelStatistics.updateChannelStartTime.split(":");
        if (splittedTime.length === 1) {
            splittedTime[1] = 0;
        }

        const nextStartDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), splittedTime[0], splittedTime[1]);

        if (nextStartDate.getTime() < currentDateTime.getTime()) {
            this._maxCounter = 0;
            for (const channelId in dbResults) {
                if (dbResults.hasOwnProperty(channelId) && this._updatedChannels.indexOf(channelId) === -1) {
                    this._updateChannelDescription(channelId, timeDefinitions, dbResults[channelId]);

                    this._updatedChannels.push(channelId);
                    this._maxCounter++;
                    if (this._maxCounter !== -1 && this._maxCounter > gConfig.features.channelStatistics.updateMaxChannelsPerLoop) {
                        break;
                    }
                }
            }
        }
    }

    _updateAllChannelDescription(timeDefinitions, dbResults) {
        // channeledit cid=15 channel_codec_quality=3 channel_description=My\sDescription
        for (const channelId in dbResults) {
            if (dbResults.hasOwnProperty(channelId)) {
                this._updateChannelDescription(channelId, timeDefinitions, dbResults[channelId]);
            }
        }
    }

    _updateChannelDescription(channelId, timeDefinitions, channel) {
        const descriptionRegExp = /\[ChannelStatistics\](?:.|\n)*\/ChannelStatistics\]/gm;
        gTeamspeak.client.send("channelinfo", {cid: channelId}, (err, resp) => {
            if (err) {
                if (err.error_id === 768) {
                    gDatabase.tableChannelStatistics.destroy({
                        where: {
                            ChannelID: channelId
                        }
                    }).then(() => {
                        console.info("Removed Channel " + channelId + " from Channelstatistics, Reason: not existing anymore.");
                    });
                }
                return console.error(err);
            }

            if (resp.data.channel_flag_permanent === 0) {
                return gDatabase.tableChannelStatistics.destroy({
                    where: {
                        ChannelID: channelId
                    }
                }).then(() => {
                    console.info("Removed Channel " + channelId + " from Channelstatistics, Reason: not permanent.");
                });
            }

            let description = resp.data.channel_description;
            const regResult = description.match(descriptionRegExp);

            const newContent = this._getNewChannelContent(channel, timeDefinitions);

            if (regResult && regResult.length > 0) {
                description = description.replace(descriptionRegExp, newContent);
            } else {
                description += ('\n\n' + newContent);
            }

            gTeamspeak.client.send("channeledit", {
                cid: channelId,
                channel_description: description
            }, error => {
                if (error) {
                    return console.error(error);
                }
            });

        });
    }

    _getNewChannelContent(channel, timeDefinitions) {
        let newContent = "[ChannelStatistics]\n";
        newContent += "Last Statistics Update: " + moment().format('MMMM Do YYYY, HH:mm:ss') + "\n";

        for (const days in channel) {
            if (channel.hasOwnProperty(days)) {
                const timeData = channel[days];
                const timeConfig = timeDefinitions[days];

                let line = timeConfig.txt;
                const lineArray = [];

                if (gConfig.features.channelStatistics.countTreeTogether) {
                    if (timeConfig.types.indexOf('avg') !== -1) {
                        lineArray.push('Avg: ' + (Math.round(timeData.SumUserWithChilds / timeData.CountedEntries * 100) / 100));
                    }

                    if (timeConfig.types.indexOf('max') !== -1) {
                        lineArray.push('Max: ' + timeData.MaxUserWithChilds);
                    }

                    if (timeConfig.types.indexOf('usage') !== -1) {
                        lineArray.push('Usage: ' + (Math.round(timeData.UserEntriesWithChilds / timeData.CountedEntries * 10000) / 100) + '%');
                    }
                } else {
                    if (timeConfig.types.indexOf('avg') !== -1) {
                        lineArray.push('Avg: ' + (Math.round(timeData.SumUser / timeData.CountedEntries * 100) / 100));
                    }

                    if (timeConfig.types.indexOf('max') !== -1) {
                        lineArray.push('Max: ' + timeData.MaxUser);
                    }

                    if (timeConfig.types.indexOf('usage') !== -1) {
                        lineArray.push('Usage: ' + (Math.round(timeData.UserEntries / timeData.CountedEntries * 10000) / 100) + '%');
                    }
                }

                line += lineArray.join(' - ');
                line += '\n';
                newContent += line;
            }
        }

        newContent += "[/ChannelStatistics]";

        return newContent;
    }

    /**
     *
     * @param doNotEdit
     * @param days
     * @returns {*}
     * @private
     */
    _generateStatsQuery(doNotEdit, days) {
        return gDatabase.tableChannelStatistics.findAll({
            attributes: [
                'ChannelID',
                [sequelize.fn('MAX', sequelize.col('UserCount')), 'MaxUser'],
                [sequelize.fn('SUM', sequelize.col('UserCount')), 'SumUser'],
                [sequelize.fn('MAX', sequelize.col('UserCountWithChilds')), 'MaxUserWithChilds'],
                [sequelize.fn('SUM', sequelize.col('UserCountWithChilds')), 'SumUserWithChilds'],
                [sequelize.fn('COUNT', sequelize.col('ID')), 'CountedEntries'],
                [sequelize.fn('COUNT', sequelize.literal("CASE WHEN UserCount > 0 THEN 1 ELSE NULL END")), 'UserEntries'],
                [sequelize.fn('COUNT', sequelize.literal("CASE WHEN UserCountWithChilds > 0 THEN 1 ELSE NULL END")), 'UserEntriesWithChilds']
                // etc
            ],
            group: ['ChannelID'],
            where: {
                createdAt: {
                    $between: [
                        new Date(new Date().getTime() - (60 * 60 * 24 * days * 1000)),
                        new Date()
                    ]
                },
                ChannelID: {
                    $notIn: doNotEdit
                }
            }
        });
    }
}
const classInstance = new ChannelStatistics();
module.exports = classInstance;