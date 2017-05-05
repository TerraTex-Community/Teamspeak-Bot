const EventEmitter = require('events');
class CommandHandler extends EventEmitter {
    constructor() {
        super();

        gTeamspeak.client.subscribe({
            event: 'textserver'
        });
        gTeamspeak.client.subscribe({
            event: 'textchannel'
        });
        gTeamspeak.client.subscribe({
            event: 'textprivate'
        });

        gTeamspeak.client.on('notify.textmessage', (eventName, resp) => {
            if (resp.invokerid !== gTeamspeak.myData.client_id) {
                this._handleMessage(resp);
            }
        });
    }

    _handleMessage(resp) {
        if (resp.msg.startsWith("!")) {
            const msgParts = resp.msg.split(" ");
            const cmd = msgParts[0].substring(1);

            msgParts.shift();
            this.emit("onCommand", {
                command: cmd,
                args: msgParts,
                msg: resp.msg,
                client: resp.invokerid,
                resp: resp
            });
        } else {
            if (resp.targetmode === 1) {
                this.emit("onText", {
                    msg: resp.msg,
                    client: resp.invokerid,
                    resp: resp
                });
            }
        }
    }
}
module.exports = new CommandHandler();
