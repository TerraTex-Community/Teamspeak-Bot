/**
 * Created by C5217649 on 05.05.2017.
 */

gCommands.on("onCommand", data => {
    if (data.command === "bot") {
        gTeamspeak.client.send("sendtextmessage", {
            targetmode: 1,
            target: data.client,
            msg: "Hallo, Ich bin der persönliche Buttler des Teamspeaks"
        });
    }
});

gCommands.on("onText", data => {
    if (data.msg.toLowerCase().indexOf("hallo") !== -1) {
        gTeamspeak.client.send("sendtextmessage", {
            targetmode: 1,
            target: data.client,
            msg: "Hallo, Ich bin der persönliche Buttler des Teamspeaks!"
        });
    }
});