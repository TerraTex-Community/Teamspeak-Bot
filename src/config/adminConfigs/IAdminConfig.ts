/**
 * Server consist out of 4 Admin Ranks:
 * - Level 4 - Server admin that has all permissions without any limits
 * - Level 3 - Administor - highest rank except server/bot  management stuff
 * - Level 2 - Moderator - moderativ rank
 * - Level 1 - Supporter
 */

export interface IAdminConfig {
    "adminRankDefinitions": {
        1: {
            name: string,
            tsGroupIds: number[]
        },
        2: {
            name: string,
            tsGroupIds: number[]
        },
        3: {
            name: string,
            tsGroupIds: number[]
        },
        4: {
            name: string,
            tsGroupIds: number[]
        }
    }
    "adminWelcomeMessage": string
}
