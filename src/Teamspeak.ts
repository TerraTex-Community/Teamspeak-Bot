import {TeamSpeakClient} from "node-ts";
import {getConfig} from "./config/loadConfig";
import Socket = NodeJS.Socket;

export let tsClient: TeamSpeakClient;

export async function createTeamspeakInstance() {
    try {
        const config = getConfig();

        tsClient = new TeamSpeakClient(config.teamspeakIp, config.queryPort);


        await tsClient.connect();
        // tsClient.setTimeout(1000 * 60 * 60 * 24);
        tsClient.unsetTimeout();
        // @ts-ignore
        tsClient.socket.setKeepAlive(true, 1000);

        await tsClient.send("login", {
            client_login_name: config.username,
            client_login_password: config.password
        });

        await tsClient.send("use", {sid: config.tsServerId});

        // @ts-ignore
        console.log(await tsClient.send("version", {}));

        // @ts-ignore
        tsClient.on("error", async err => {
            console.error("Teamspeak Error: ", err);
            await reconnectClient();
        });
        // @ts-ignore
        tsClient.on("close", async () => {
            console.error("Teamspeak closed connection");
            await reconnectClient();
        });
        // @ts-ignore
        tsClient.on("timeout", async () => {
            await reconnectClient();
        });

        setInterval(async () => {
            try {
                // @ts-ignore
                await tsClient.send("ping", {});
            }catch (e) {
            }
        }, 10000);

    } catch (err) {
        console.error("An error occurred:");
        console.error(err);
    }
}

export async function reconnectClient() {
    try {
        console.log("try to reconnect");
        // @ts-ignore
        tsClient.socket.end();
        await tsClient.connect();
    } catch (e) {
        console.error(e);
    }
}
