import "./defaultCommands";
import {getConfig} from "../config/loadConfig";
import {initRegistration} from "./registration/registration";
import {ChannelStatistics} from "./channelStatistics/ChannelStatistics";
import {initWelcomeMessage} from "./welcomeMessage/welcomeMessage";

export async function enableFeatures() {
    if (getConfig().features.registration.enabled) {
        await initRegistration();
    }

    if (getConfig().features.channelStatistics.enabled) {
        new ChannelStatistics();
    }

    if (getConfig().features.welcomeMessage.enabled) {
        await initWelcomeMessage();
    }
}
