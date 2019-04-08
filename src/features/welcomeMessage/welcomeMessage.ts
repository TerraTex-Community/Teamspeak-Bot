import {tsClient} from "../../Teamspeak";
import {getConfig} from "../../config/loadConfig";

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
}
