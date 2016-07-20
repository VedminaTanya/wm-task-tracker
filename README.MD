# Web-Manufacture Task tracker

Custom "task tracker" allow users to register their profiles, take tasks from "free tasks list" or see their tasks (assigned by admin ), create "finish request" after actual implementation of work and edit task ticket additional fields - "How I understand task?", "Comments" etc.

[Temporary deployed on heroku](https://wm-task-tracker.herokuapp.com/)

[API detailed documentation](https://wm-task-tracker.herokuapp.com/doc)

    To run locally:
    $ git clone https://github.com/polesskiy-dev/wm-task-tracker
    $ cd wm-task-tracker
    $ npm install   
    $ npm start
    # open in browser http://localhost:3000
    
> If you use windows os - there may be problems with compiling bcrypt library, 
see [node-gyp](https://github.com/nodejs/node-gyp) and follow appropriate instructions to install it and Visual C++ Build Environment, Python etc.
OR you can replace bcrypt library (all usages and in package.json) on bcryptjs in your local repository.

## Entities

### User

    * Full name
    * Contact number
    * Email
    * Education
    * Key skills
    * Additional info
    * Password
    * Role [user, admin]
    
### Task ticket

    * Name
    * Task text (can contain html tags)
    * How I understand task?
    * Comments
    * Expiration date
    * Additional files
    * Status [assigned, in progress, finish request, finished (for admin)]
    
### User common board

Divided into 2 areas - 
    
    * My tasks - assigned by admin or self-taked
    * Available free tasks - not assigned to anyone.
    
### Admin common board

    * Free tasks
    * Already assigned, but not finished tasks
    * Waiting for "finished" state approve
     
     
    
