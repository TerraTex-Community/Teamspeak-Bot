import "reflect-metadata";
import {createConnection} from "typeorm";
import {loadConfig} from "./config/loadConfig";
import {createTeamspeakInstance} from "./Teamspeak";
import {tsCommandHandler} from "./TsCommandHandler";
import {enableFeatures} from "./features/toggles";

async function main() {
    await createConnection();
    await loadConfig();
    await createTeamspeakInstance();
    await tsCommandHandler.init();
    await enableFeatures();
}

main();
