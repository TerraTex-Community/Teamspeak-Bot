import {existsSync, promises, unlinkSync, writeFileSync} from "fs";
import * as deepmerge from 'deepmerge'
import {defaultConfig} from "./defaultConfig";
import {IAdminConfig} from "./adminConfigs/IAdminConfig";
import {IFeatureConfiguration} from "./featureConfigs/IFeatureConfigs";

let config: IConfig;

export async function loadConfig() {
    if (existsSync("config.json")) {
        const loadedFile = JSON.parse((await promises.readFile("config.json")).toString());

        // @ts-ignore
        config = deepmerge(defaultConfig, loadedFile, {
            arrayMerge: (destinationArray, sourceArray, options) => sourceArray
        });
    } else {
        if (existsSync("example.config.json")) {
            unlinkSync("example.config.json");
        }
        writeFileSync("example.config.json", JSON.stringify(defaultConfig, null, "    "));

        console.error("Config file config.json missing. Use generated example.config.json and rename it after editing");
        process.exit(1);
    }
}

export function getConfig(): IConfig {
    return config;
}

export interface IConfig {
    teamspeakIp: string,
    queryPort: number,
    tsServerId: number,
    username: string,
    password: string,
    admin: IAdminConfig
    features: IFeatureConfiguration
}

