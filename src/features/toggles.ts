import "./defaultCommands";
import {getConfig} from "../config/loadConfig";
import {initRegistration} from "./registration/registration";
import {ChannelStatistics} from "./channelStatistics/ChannelStatistics";

export async function enableFeatures() {
    if (getConfig().features.registration.enabled) {
        await initRegistration();
    }

    if (getConfig().features.channelStatistics.enabled) {
        new ChannelStatistics();
    }
}
