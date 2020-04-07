# Reminder App Documentation

### Project Purpose

- As part of our COMP 1800 course, the goal was to design and build a reminder application with these major features:
  - Create, edit, and delete reminders
  - Share reminders with friends in the application \* Functional user registration, login, and authentication
- Practice collaboration with team members in an agile development setting:
  - Sprint planning, using a Trello board to keep track of tasks
  - Using git for version control and methods such as cloning, branching, committing, pull requests, and merging branches \* Project Management

---

### Team Members

- Kirk Wong kwong447@my.bcit.ca
- Cindy Lu cindylu26810@gmail.com
- Mike Sampson mikesampson68@gmail.com
- Hudson McManus hudson.mcmanus@gmail.com
- Jessica Hong jeessicahong@gmail.com

---

### Tools and Technologies

- Node.js
- Express.js
- Mongoose / MongoDB
- Bootstrap
- Handlebars.js
- HTML/CSS

---

### Code and Folder Structure

##### app.js

- The base file that sets up the express application and other packages that will be used in the application

##### router.js

- Taken from https://expressjs.com/en/guide/routing.html: “Routing refers to how an application’s endpoints (URIs) respond to client requests.”
- The router.js file handles the bulk of the reminder application’s logic including rendering pages when there are GET requests to querying and saving data in the database
- Here, you will find the various endpoints such as /create, /edit, and /add-friend.

##### database.js

- Sets up the two MongoDB schemas: reminderSchema and userSchema, which will be used to create and save reminders and users.

##### views folder

- Contains all of the handlebars files used to display the pages in the application. This includes the create page, edit page, login page, etc.
- Partials subfolder contains templates that can be shared among different templates. This includes the navbar, footer, and bootstrap modals.

##### static folder

- Contains the static files including images, CSS files, Javascript files, etc.

---

### How to run locally

- You must have node.js and mongoDB installed
  - https://nodejs.org/en/download/
  - https://www.mongodb.com/download-center/community
- Ensure that mongoDB is running
- Navigate to the folder in your terminal
- Type “npm install” to download the package dependencies
- Create a config.json file that sets the port, database URL, and jwt secret \* config.json can be an exact copy of the config.sample.json
- Run the app using the terminal command: “node app”
- In your browser, navigate to http://localhost:3000/ (port is 3000 if you copied the config)

---

### Screenshots

##### Landing Page

![landing_page](https://github.com/hudsonmcmanus/reminder-app/blob/master/screenshots/landing_page.JPG)

##### Main Page

![main_page](https://github.com/hudsonmcmanus/reminder-app/blob/master/screenshots/main_page.JPG)

##### Create Reminder

![create_reminder](https://github.com/hudsonmcmanus/reminder-app/blob/master/screenshots/create_reminder.JPG)

##### Add Friend

![add_friend](https://github.com/hudsonmcmanus/reminder-app/blob/master/screenshots/add_friend.JPG)

##### Share Reminders

![share_reminders](https://github.com/hudsonmcmanus/reminder-app/blob/master/screenshots/share_reminders.JPG)

---

### Authentication

- Authentication uses [JWT tokens](https://jwt.io/) via a browser cookie.
- Tokens expire after **7 days** of no use.

---

### Front End

- Implemented Bootstrap for every page.
- Uses Helvetica Neue font.
- Color theme used were muted blues and greys. #6875a1 For navbar, #007bff For headers, and #222 for the footer.
- Uses a simple and bright layout.
- Mobile friendly.

---

### Incomplete Features

- User is able to import reminders using the json file that was exported
    - Approach: Parse the json file and loop through entire list, storing each reminder as it's own document in the database.
- Reminders that are shared with friends will have to be accepted before showing up on their main page
    - Approach: Add an additional page that would show reminders that have been shared with the user, giving the option to accept them as their own.

---

### Plan of Action

[Plan Of Action](https://github.com/hudsonmcmanus/reminder-app/blob/master/PlanOfAction.md)
