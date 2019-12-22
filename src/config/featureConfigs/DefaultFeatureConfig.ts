import {defaultRegistrationConfig} from "./DefaultRegistrationConfiguration";
import {defaultChannelStatisticsConfiguration} from "./DefaultChannelStatisticsConfiguration";
import {IFeatureConfiguration} from "./IFeatureConfigs";

export const defaultFeatureConfig: IFeatureConfiguration = {
    welcomeMessage: {
        enabled: true,
        message: "Willkommen auf dem Teamspeak. Mich erreichst du unter !bot"
    },
    channelStatistics: defaultChannelStatisticsConfiguration,
    registration: defaultRegistrationConfig
};
