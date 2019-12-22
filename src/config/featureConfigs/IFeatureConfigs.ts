import {IChannelStatisticsConfiguration} from "./IChannelStatisticsConfiguration";
import {IRegistrationConfiguration} from "./IRegistrationConfiguration";


export interface IFeatureConfiguration {
    channelStatistics: IChannelStatisticsConfiguration,
    registration: IRegistrationConfiguration
    welcomeMessage: {enabled: boolean, message: string}
}
