/**
 * Created by geramy on 20.02.17.
 */

class ChannelStatistics {
    constructor() {
        //setInterval(this.updateChannelEntries.bind(this), 600000);
        this.updateChannelEntries();
    }

    updateChannelEntries() {
        gTeamspeak.client.send("channellist", (err, resp, req) => {
            console.log(err, resp, req);
            // cid, pid?, channel_name, total_clients
        });
        console.log("test")
    }
}
const classInstance = new ChannelStatistics();
module.exports = classInstance;