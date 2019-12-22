import {tsClient} from "../Teamspeak";
import {getConfig} from "../config/loadConfig";

export async function getAdminLevel(cliendDbId: number): Promise<number> {
    // @ts-ignore
    const data = await tsClient.send("servergroupsbyclientid", {
        cldbid: cliendDbId
    });

    let highestLvl = 0;
    for (const groupData of data.response) {
        for(let i = 4; i > 0; i--) {
            if (getConfig().admin.adminRankDefinitions[i].tsGroupIds.indexOf(groupData.sgid)) {
                if (i > highestLvl) {
                    highestLvl = i;
                }
            }
        }
    }

    return highestLvl;
}
