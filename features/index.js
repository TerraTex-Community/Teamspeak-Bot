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

if (gConfig.features.botNativeChat.enabled) {
    require("./botNativeChat");
}

// defaults
require("./registerDefaultCommands");
