import {defaultFeatureConfig} from "./featureConfigs/DefaultFeatureConfig";
import {defaultAdminConfig} from "./adminConfigs/DefaultAdminConfig";
import {IConfig} from "./loadConfig";

export let defaultConfig: IConfig = {
    teamspeakIp: "127.0.0.1",
    // on Terratex: 20000
    queryPort: 10011,
    tsServerId: 1,
    username: null,
    password: null,

    features: defaultFeatureConfig,
    admin: defaultAdminConfig
};



