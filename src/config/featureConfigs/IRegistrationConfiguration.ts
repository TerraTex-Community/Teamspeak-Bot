export interface IRegistrationConfiguration {
    enabled: boolean,
    /**
     * enable automatic group registration
     */
    automatic: boolean,
    /**
     *  set group after [automaticAfterConnectTime] Minutes connection time  (0 or lower will directly set group)
     */
    automaticAfterConnectTime: number,
    /**
     * groupId that should be set
     */
    groupId: number,
    /**
     * set only once or everytime user has not this group
     */
    onlyOnce: boolean
}
