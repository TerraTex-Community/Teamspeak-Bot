/**
 * Created by geramy on 20.02.17.
 */

// require channelSats
if (gConfig.features.channelStatistics.enabled) {
    require("./channelStatistics");
}

if (gConfig.features.registration.enabled) {
    require("./registration");
}
