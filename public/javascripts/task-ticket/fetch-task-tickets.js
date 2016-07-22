"use strict";
/**
 * @see <a href="https://learn.javascript.ru/promise"></a>
 */
const fetchTasks = (function () {
    const TASKS_API_URL = "/api/tasks";
    const USERS_API_URL = "/api/users";

    /**
     * GET all tasks by url promise.
     *
     * @param fetchTasksUrl
     * @returns {Promise}
     */
    function getTaskObjsPromise(fetchTasksUrl) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', fetchTasksUrl || TASKS_API_URL, true);

            xhr.onload = function () {
                if (this.status == 200) {
                    try {
                        let taskArr = JSON.parse(this.response);
                        resolve(taskArr);
                    } catch (error) {
                        reject(error);
                    }
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

    return {
        /**
         * GET all tasks promise decorator.
         *
         * Fetch tasks from server with desired status or just all,
         * assigned to user or all tasks.
         *
         * @param taskStatus {String} - desired status of tasks
         * @param userLogin {String} - user's login
         * @returns {Promise}
         */
        getAllTasksPromise: function (taskStatus, userLogin) {
            let URL = userLogin ? (USERS_API_URL + "/" + userLogin + "/" + "tasks/") : TASKS_API_URL + "/" + taskStatus ? taskStatus : "";
            //fetch tasks
            return getTaskObjsPromise(URL);
        }
    }
})();