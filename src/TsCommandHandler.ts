
import {tsClient} from "./Teamspeak";
import {EventEmitter} from "events";
import {TextMessageNotificationData} from "node-ts";

class TsCommandHandler extends EventEmitter {
    async init() {
        await this.registerEvents();
    }

    async registerEvents() {
        // @ts-ignore

        await tsClient.subscribePrivateTextEvents();
        await tsClient.subscribeChannelTextEvents();
        await tsClient.subscribeServerTextEvents();

        // @ts-ignore
        tsClient.on("textmessage", async data => {
            // @ts-ignore
            const dArray: TextMessageData[] = data;
            for(const message of dArray) {
                await this.handleTextMessage(message);
            }
        });

    }

    async handleTextMessage(data: TextMessageData) {
        if (data.msg.startsWith("!")) {
            // is a command
            const msgParts = data.msg.split(" ");
            const cmd = msgParts[0].substring(1);
            msgParts.shift();

            this.emit("onCommand", {
                command: cmd,
                args: msgParts,
                data
            });

        } else {
            // is normal message
            this.emit("onTextMessage", data);
        }
    };
}

export let tsCommandHandler: TsCommandHandler;
tsCommandHandler = new TsCommandHandler();

export interface TextMessageData extends TextMessageNotificationData {
    invokerid: number,
    invokername: string,
    invokeruid: string
}

declare interface TsCommandHandler {
    on(event: "onCommand", listener: (data: {
        command: string,
        args: string[],
        data: TextMessageData
    }) => void): this;

    on(event: "onTextMessage", listener: (data: TextMessageData) => void): this;
}
