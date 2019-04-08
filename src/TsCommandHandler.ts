
import {tsClient} from "./Teamspeak";
import {EventEmitter} from "events";
import {TextMessageNotificationData} from "node-ts";

class TsCommandHandler extends EventEmitter {
    private commandHandler: {[index: string]: {
            func: (args: string[], data: TextMessageData) => {},
            description: string
        }
    } = {};

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
            const cmd = msgParts[0].substring(1).toLowerCase();
            msgParts.shift();

            this.emit("onCommand", {
                command: cmd,
                args: msgParts,
                data
            });

            if (this.commandHandler[cmd]) {
                this.commandHandler[cmd].func(msgParts, data);
            }

        } else {
            // is normal message
            this.emit("onTextMessage", data);
        }
    };

    registerCommand(cmds: string[], handlerFunc: (args: string[], data: TextMessageData) => {}, description="") {
        for (let cmd of cmds) {
            cmd = cmd.toLowerCase();
            if (!this.commandHandler[cmd]) {
                this.commandHandler[cmd] = {
                    func: handlerFunc,
                    description
                };
            } else {
                throw new Error("Cmd already exist!");
            }
        }
    }

    getAllCommands() {
        return this.commandHandler;
    }
}

export let tsCommandHandler: TsCommandHandler;
tsCommandHandler = new TsCommandHandler();

export function registerCommand(cmds: string[], handlerFunc: (args: string[], data: TextMessageData) => {}, description="") {
    tsCommandHandler.registerCommand(cmds, handlerFunc);
}

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
