import {tsClient} from "../../Teamspeak";
import {getConfig} from "../../config/loadConfig";
import {getAdminLevel} from "../../lib/admin";
import {compile} from "handlebars";

export async function initWelcomeMessage() {
    await tsClient.subscribeServerEvents();

    tsClient.on('cliententerview', async data => {
        await onUserJoin(data[0]);
    });
}

async function onUserJoin(data) {
    await tsClient.send("sendtextmessage", {
        targetmode: 1,
        target: data.clid,
        msg: getConfig().features.welcomeMessage.message
    });

    // @info: extend with admin info message
    const adminLvl = await getAdminLevel(data.client_database_id);
    if (adminLvl > 0) {
        const rankname = getConfig().admin.adminRankDefinitions[adminLvl].name;
        const template = compile(getConfig().admin.adminWelcomeMessage);
        const message = template({rankname});

        await tsClient.send("sendtextmessage", {
            targetmode: 1,
            target: data.clid,
            msg: message
        });
    }

}
