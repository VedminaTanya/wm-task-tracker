"use strict";
/**
 * Permissions for users.
 *
 * Describe obj with entities whom allowed access.
 */
class Permissions {
    /**
     * @constructor
     * @param userLogin - concrete user login
     * @param roles - roles array
     */
    constructor(userLogin, roles) {
        this.userLogin = userLogin;
        this.roles = roles;
    }
}

module.exports = Permissions;