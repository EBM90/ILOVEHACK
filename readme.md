**I <3 HACK**, is the ideal application to **find that better half** you are looking for to plant your garden of love. An application with the function of finding that person related to you, do not get carried away only by physical appearance but also you will complete a test to find the best possible compatibility with any user of the platform.
They say that love is blind ... let's check it then.
You also have the events tab available, where the places and the date will appear where you can spend a pleasant evening with a random person for a limited time, on a speed dating format.
Your heart is a code, let them hack you.


## User Stories
- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **Sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **Login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **My profile** - As a user I want to see and edit my profile
- **Match list** - As a user I want to see my best matches on my profile
- **FAQ** - As a user I want an answer to my questions
- **All events list** - As a user I want to see all the events available so that I can choose which ones I want to attend
- **Favorite events** - As a user I want to be able to attend to event so that the organizers can count me in

## Models    

User model

```
{
fullname: String,
birthdate: Date,
genre: String,
mail: String,
photo: String,
questions:[String]
}
```

Event model

```
{
name: String,
date: Date,
ubication: String,
description: String,
photo: String,
}
```



## Routes
- GET /
  - Renders the homepage
- GET /auth/signup
  - Redirects to / if user logged in
  - Renders the signup form
- POST /auth/signup
  - Redirects to / if user logged in
  - Body:
    - Full name
    - E-mail
    - Password
    - Repeat password
    - Genre
    - Birth date
    - Love test
- GET /auth/login
  - Redirects to / if user logged in
  - Renders the login form 
- POST /auth/login
  - Redirects to / if user logged in
  - Body:
    - e-mail
    - password
- POST /auth/logout
  - Body: (empty)
- GET /events
  - Renders the event list + saved/favourite events
- GET /events/:id
  - renders the event detail page
  - includes the number (no names) of attendees -> maybe backlog
  - attend button if user not attending yet -> maybe backlog
- POST /events/:id/attend
  - redirects to / if user is anonymous
  - body: (empty - the user is already stored in the session)



## <h2>MVP:</h2>
* Allowing users to sign up and log in, while recording their data in a data base (using MongoDB ).
* The sign up and log in must have minimum validation requirements
* The user should have the posibility of creating, reading, updating and deleting (CRUD) personal challenges
* The user should have the posibility of joining social challenges already created by us
* The user should be able of modifying his/her personal info and profile image. His/her profile images will be storage in a cloud (cloudinary)
* Have 2 models or more
* Use Express


<h2>Backlog:</h2>
- Speed dating on Skype or Zoom
- LGTB version(poner imagen y url y cuando clic pagina en desarrollo + animación)

<h2>Data strucuture:</h2>

I<3hack-project/
        ├── .gitignore
        ├── .env
        ├── app.js
        ├── readme.md
        ├── bin
        │   ├── seeds.js
        │   └── www
        ├── config
        │   └── ??????
        ├── middlewares
        │   └── ??????
        ├── models
        │   ├── users.js
        │   ├── events.js 
        ├── public
        │   ├── images
        │   ├── scripts
        │   └── stylesheets
        ├── routes
        │   ├── index.js
        │   ├── auth.js
        │   └── private
        │       ├── users.js
        │       ├── events.js
        │
        └── views
            ├── error.hbs
            ├── index.hbs
            ├── layout.hbs
            ├── events.hbs
                 |——- edit.hbs
                 |——- delete.hbs  
                ├── create.hbs      
            ├── auth
            │   ├── login.hbs
            │   └── signup.hbs
            └── private
                ├── userprofile.hbs
                   ├── citas
                    └── edit.hbs



Link github: <a>https://github.com/chipiriguino/I-3HACK</a>
Link trello: <a>https://trello.com/b/WDLCNTMt/apes-strong-together</a>
Link I<3HACK: 
