const taskPanelsFactory = (function () {
    let createPanel = function (taskTicketObj) {
        //article - panel container
        let taskArticle = document.createElement('article');
        taskArticle.className = "col-xs-12 col-sm-6 col-md-4 expanding-content-container";
        taskArticle.id = taskTicketObj._id + "Article";

        //panel
        let taskPanel = document.createElement('div');
        taskPanel.className = "panel panel-default";

        //panel header
        let taskPanelHeader = document.createElement('div');
        taskPanelHeader.className = "panel-heading";
        taskPanelHeader.innerText = taskTicketObj.name;

        //task status and urgency label
        let taskStatusLabel = document.createElement('span');
        taskStatusLabel.className = "label label-as-badge pull-right";
        switch (taskTicketObj.urgency) {
            case "medium":
                taskStatusLabel.className += "label-warning";
                break;
            case "danger":
                taskStatusLabel.className += "label-danger";
                break;
        }
        taskStatusLabel.textContent = taskTicketObj.task_status;

        //panel body
        let taskPanelBody = document.createElement('div');
        taskPanelBody.className = "panel-body";
        let taskParagraph = document.createElement('p');
        taskParagraph.innerText = taskTicketObj.task_text;
        taskPanelBody.appendChild(taskParagraph);

        //panel footer
        let taskPanelFooter = document.createElement('div');
        taskPanelFooter.className = "panel-footer";
        //TODO create buttons in footer

        //append all one in one
        taskArticle.appendChild(taskPanel);
        taskPanel.appendChild(taskPanelHeader);
        taskPanelHeader.appendChild(taskStatusLabel);
        taskPanel.appendChild(taskPanelBody);
        taskPanel.appendChild(taskPanelFooter);

        return taskArticle;
    };

    return {
        getSinglePanel: createPanel
    }
})();