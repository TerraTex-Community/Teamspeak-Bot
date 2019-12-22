import {IRegistrationConfiguration} from "./IRegistrationConfiguration";

export const defaultRegistrationConfig: IRegistrationConfiguration= {
    // should registration feature enabled
    enabled: true,
    // enable automatic group registration
    automatic: true,
    // set group after [automaticAfterConnectTime] Minutes connection time  (0 or lower will directly set group)
    automaticAfterConnectTime: 10,
    // groupId that should be set
    groupId: 0,
    // set only once or everytime user has not this group
    onlyOnce: true
};
