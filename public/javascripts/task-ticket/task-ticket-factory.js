"use strict";
/**
 * @see <a href="https://learn.javascript.ru/promise"></a>
 */
const taskTicketFactory = (function () {
    const TASKS_API_URL = "/api/tasks";
    const USERS_API_URL = "/api/users";

    return {
        /**
         * GET all tasks promise.
         *
         * Fetch tasks from server with desired status or just all,
         * assigned to user or all tasks.
         *
         * @param taskStatus {String} - desired status of tasks
         * @param userLogin {String} - user's login
         * @returns {Promise}
         */
        getAllTasks: function (taskStatus, userLogin) {
            let URL = userLogin ? (USERS_API_URL + "/" + userLogin + "/" + "tasks/") : TASKS_API_URL + "/" + taskStatus ? taskStatus : "";
            console.log(URL);

            return new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();

                xhr.open('GET', url, true);

                xhr.onload = function () {
                    if (this.status == 200) {
                        //TODO return here not string but tasks array
                        resolve(this.response);
                    } else {
                        var error = new Error(this.statusText);
                        error.code = this.status;
                        reject(error);
                    }
                };

                xhr.onerror = function () {
                    reject(new Error("Network Error"));
                };

                xhr.send();
            });
        }
    }
})
();