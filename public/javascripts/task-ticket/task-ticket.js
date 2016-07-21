"use strict";

class TaskTicket{

    /**
     * Task ticket.
     *
     * @param taskTicketJSON {string} - serialized task ticket
     */
    constructor(taskTicketJSON){
        let taskTicketDTO = {};
        try {
            taskTicketDTO = JSON.parse(taskTicketJSON);
        } catch (e) {
            console.error("Trying to parse task ticket DTO %s, but error occurs: %s", taskTicketJSON, e);
        }

        this._id = taskTicketDTO._id;
        this.name = taskTicketDTO.name;
        this.task_text = taskTicketDTO.task_text;
        this.expiration_date = taskTicketDTO.expiration_date;
        this.additional_files = taskTicketDTO.additional_files;
        this.task_status = taskTicketDTO.task_status;
    }

    
}