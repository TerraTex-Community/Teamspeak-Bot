import {tsCommandHandler} from "../TsCommandHandler";
import {tsClient} from "../Teamspeak";


tsCommandHandler.registerCommand(["bot"], async (args, cmdData) => {
    try {
        await tsClient.send("sendtextmessage", {
            targetmode: 1,
            target: cmdData.invokerid,
            msg: "Hallo, Ich bin der persönliche Buttler des Teamspeaks! Eine Hilfe erhälst du unter !hilfe"
        });
    } catch (e) {
        console.error("Error in !bot: ", e, cmdData)
    }
}, "Öffne den Chat mit dem Bot.");

tsCommandHandler.registerCommand(["hilfe"], async (args, cmdData) => {
    try {
        let helpString = "\n[u][b]Hilfe - Liste aller Botbefehle:[/b][/u] \n";
        const cmds = tsCommandHandler.getAllCommands();

        for (const cmd in cmds) {
            const cmdData = cmds[cmd];
            helpString += `[b]!${cmd}[/b] - ${cmdData.description}\n`;
        }

        await tsClient.send("sendtextmessage", {
            targetmode: 1,
            target: cmdData.invokerid,
            msg: helpString
        });
    } catch (e) {
        console.error("Error in !bot: ", e, cmdData)
    }
}, "Zeigt die Hilfe.");
