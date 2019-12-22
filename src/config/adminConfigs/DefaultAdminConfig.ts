import {IAdminConfig} from "./IAdminConfig";

export const defaultAdminConfig: IAdminConfig = {
    adminRankNames: {
        1: {name: "Serverleitung", tsGroupIds: []},
        2: {name: "Administraor", tsGroupIds: []},
        3: {name: "Moderator", tsGroupIds: []},
        4: {name: "Supporter", tsGroupIds: []}
    },
};
