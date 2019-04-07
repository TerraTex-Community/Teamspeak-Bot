import {getConfig} from "../../config/loadConfig";
import {tsClient} from "../../Teamspeak";
import {TsUser} from "../../db/entity/TsUser";

export async function initRegistration() {
    if (getConfig().features.registration.automatic) {
        await tsClient.subscribeServerEvents();

        tsClient.on('cliententerview', async data => {
            await onUserJoin(data[0]);
        });
    }
}

async function onUserJoin(data) {
    const usersInDb = await TsUser.find({
        where: {
            uniqueId: data.client_unique_identifier
        }
    });
    let dbUser: TsUser;
    if (usersInDb.length === 0) {
        dbUser = new TsUser();
        dbUser.uniqueId = data.client_unique_identifier;
        dbUser.registered = false;
        dbUser.lastNickname = data.client_nickname;
        dbUser.lastLogin = new Date();
        await dbUser.save();
        await dbUser.reload();
    } else {
        dbUser = usersInDb[0];
    }

    dbUser.lastLogin = new Date();
    dbUser.lastNickname = data.client_nickname;
    await dbUser.save();

    if (getConfig().features.registration.automaticAfterConnectTime > 0) {
        setTimeout(async () => {
            await checkRegistration(data, dbUser);
        }, getConfig().features.registration.automaticAfterConnectTime);
    } else {
        await checkRegistration(data, dbUser);
    }

}

async function checkRegistration(data, dbUser: TsUser) {
    const clientId = data.clid;

    const clientInfo = await tsClient.send("clientinfo", {clid: clientId});
    const connectedTime = Math.round((new Date()).getTime() / 1000) - clientInfo.response[0].client_lastconnected + 10;

    // if connected time is smaller it means there was a reconnect during that time
    if (connectedTime > getConfig().features.registration.automaticAfterConnectTime) {
        if (clientInfo.response[0].client_nickname.indexOf("TeamSpeakUser") !== -1) {
            if (!dbUser.registered || !getConfig().features.registration.onlyOnce) {
                await registerGroup(data, dbUser);
            }
        } else {
            tsClient.send("sendtextmessage", {
                targetmode: 1,
                target: clientId,
                msg: "Bitte ändere deinen Nickname."
            });

            setTimeout(async () => {
                await checkRegistration(data, dbUser);
            }, getConfig().features.registration.automaticAfterConnectTime);
        }
    }
}

async function registerGroup(data, tsUser: TsUser) {
    // @ts-ignore
    await tsClient.send("servergroupaddclient", {
        cldbid: data.client_database_id,
        sgid: getConfig().features.registration.groupId
    });

    tsUser.registered = true;
    await tsUser.save();
}
