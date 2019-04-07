import {tsCommandHandler} from "../TsCommandHandler";
import {tsClient} from "../Teamspeak";

tsCommandHandler.on("onCommand", async cmdData => {
    try {
        if (cmdData.command.toLowerCase() === "bot") {
            await tsClient.send("sendtextmessage", {
                targetmode: 1,
                target: cmdData.data.invokerid,
                msg: "Hallo, Ich bin der persönliche Buttler des Teamspeaks"
            });
        }
    } catch (e) {
        console.error("Error in !bot: ", e, cmdData)
    }
});
