# Web-Manufacture Task tracker

Custom task tracker allow user to register their profile, take tasks from "free tasks list" 
or see assigned by admin tasks, create "finish request" after actual implementation, 
edit task additional fields - "How I understand task?" and "Comments".
 
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
     
     
    