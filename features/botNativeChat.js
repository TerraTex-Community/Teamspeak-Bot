/**
 * Created by C5217649 on 05.05.2017.
 */
const watson = require('watson-developer-cloud');

class BotNativeChat {
    constructor() {
        const conversation = watson.conversation({
            username: "6ea7a95e-e8d2-422b-bdc8-a66b537c62bc",
            password: gConfig.features.botNativeChat.ibm.password,
            version: gConfig.features.botNativeChat.ibm.version,
            version_date: gConfig.features.botNativeChat.ibm.version_date,
            url: "https://gateway-fra.watsonplatform.net/conversation/api"
        });
        this._conversation = conversation;

        gCommands.on("onText", this._receivedMessage.bind(this));
    }

    _receivedMessage(data) {
        this._conversation.message({
            workspace_id: gConfig.features.botNativeChat.ibm.workspace_id,
            input: {'text': data.msg},
            context: {}
        },  function(err, response) {
            if (err) {
                console.log('error:', err);
            } else {
                if (response.output.text.length > 0) {
                    gTeamspeak.client.send("sendtextmessage", {
                        targetmode: 1,
                        target: data.client,
                        msg: response.output.text[Math.floor(Math.random() * response.output.text.length)]
                    });
                } else {
                    gTeamspeak.client.send("sendtextmessage", {
                        targetmode: 1,
                        target: data.client,
                        msg: "Darauf habe ich leider keine Antwort."
                    });
                }
            }
        });
    }
}
const classInstance = new BotNativeChat();
module.exports = classInstance;