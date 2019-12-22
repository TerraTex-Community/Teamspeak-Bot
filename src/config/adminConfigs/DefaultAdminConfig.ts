import {IAdminConfig} from "./IAdminConfig";

export const defaultAdminConfig: IAdminConfig = {
    adminWelcomeMessage: "[color=#ff0000]Du hast einen administrativen Rang. Der Bot erkennt dich als {{rankname}}.[/color]",
    adminRankDefinitions: {
        4: {name: "Serverleitung", tsGroupIds: []},
        3: {name: "Administraor", tsGroupIds: []},
        2: {name: "Moderator", tsGroupIds: []},
        1: {name: "Supporter", tsGroupIds: []}
    },
};
