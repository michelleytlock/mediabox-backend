# MediaBox

<br>

## Description

MediaBox is an app that asks users what they think about movies and tv shows they have already seen, and based on those ratings, provides movie and tv show recommendations for the user. 


## Core Features

- Rate movies/tv shows already watched
- See personalised recommendations on things to watch
- Add movies/tv shows to watch later to a watchlist
- See details about specific movies/tv shows
- See viewership stats on profile


## User Stories

- **Landing:** As a new user, I want to know I am at the right place by seeing the app’s name and logo and a brief introduction of the app.
-  **404:** As an anon/user I can see a 404 page if I try to go to a page that does not exist so I know to go back.
-  **Signup:** As an anon/user, I can see a sign up form so that I can make my own user profile to get access to the app.
-  **Login:** As an anon/user, I can log in so I can continue using the app.
-  **Logout:** As a user, I can log out of the platform so others will not have access to it on the same device.
-  **Onboarding:** As a user, I will go through an initial onboarding flow of rating at least 10 movies/tv shows so that the app can immediately start recommending things to watch based on my preferences.
-  **Discover:** As a user, I can find movies/tv shows recommended to me based on my preferences, and depending on whether I’ve seen them or not, add a rating, add to my watchlist, or skip. Also, I am able to search for specific content, and filter by trending or by genre. 
-  **Watchlist:** As a user, I can find movies/tv shows I have previously saved to this list, things that I haven’t seen yet but want to in the future. 
-  **Profile:** As a user, I can see all the ratings I’ve ever given and filter through those, my watching stats, my favorite directors, and my most watched genres. 


## Backlog

- Add a tutorial to onboarding flow
- Swiping animation
- Add reviews to each media
- Add social functionality - see movies/tv shows friends have rated, their ratings, their recommendations, messaging

<br>


# Client / Frontend

## React Router Routes (React App)
| Path                      | Component                      | Permissions | Behavior                                                     |
| ------------------------- | --------------------           | ----------- | ------------------------------------------------------------ |
| `/`                       | LandingPage                    | public `<Route>`            | Landing page about the app                   |
| `/signup`                 | SignupPage                     | anon only  `<AnonRoute>`    | Signup form, link to login, redirect to Homepage after        |
| `/login`                  | LoginPage                      | anon only `<AnonRoute>`     | Login form, link to signup, redirect to Homepage after        |
| `/logout`                 | N/A                            | user only `<PrivateRoute>`  | Button, redirect to Landing page, delete session              |
| `/onboarding    `         | Onboarding, Rater              | user only `<PrivateRoute>`  | Rate 10 movies and 10 tv shows to begin, progress bar changes with each render, ratings added to user model                                |
| `/home/movies`            | Navbar, Rater, Filter          | user only `<PrivateRoute>`  | Show recommended movie                                        |
| `/home/tvshows`           | Navbar, Rater, Filter          | user only `<PrivateRoute>`  | Show recommended tv show                                      |
| `/movie/:id`              | Navbar, MediaDetails           | user only  `<PrivateRoute>` | Show details about the movie                                  |
| `/tvshow/:id`             | Navbar, MediaDetails           | user only `<PrivateRoute>`  | Show details about the tv show                                |
| `/watchlist/movies`       | Navbar, List, Filter           | user only `<PrivateRoute>`  | Show movies on watchlist                                      |
| `/watchlist/tvshows`      | Navbar, List, Filter           | user only `<PrivateRoute>`  | Show tv shows on watchlist                                    |
| `/profile`                | Navbar, Profile                | user only  `<PrivateRoute>` | Check profile with stats, rating history                      |
          

## Components

- LandingPage

- SignupPage

- LoginPage

- Onboarding

- NavBar

- Rater

- Filter

- MediaDetails

- List

- Profile

- SearchResults


## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()

- MediaBox Service
  - media.rate(id) // (add to user model's list, update listType and rating)
  - media.skip(id) // (add to user model's list, update listType)
  - media.add(id) // (add to user model's list, update listType)
  - media.detail(id) // see details of movie/tv show
  - media.filter
  
- External API
  - api.random()
  - api.recommended()
  - api.filter(search)


<br>


# Server / Backend


## Models

User model

```javascript
{
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  list: [{mediaId: {type: Schema.Types.ObjectId,ref:'Media'}, listType: String, rating: Number}]
}
```



Media model

```javascript
 {
   apiId: {type: Number, required: true},
   title: {type: String, required: true},
   tagline: {type: String},
   genres: [{type: String, required: true}],
   image: {type: String, required: true},
   description: {type: String, required: true},
   releaseDate: {type: Date},
   runtime: {type: Number},
   director: {type: String},
   cast: [{type: String, required: true}],
   networks: [{type: String}],
   firstAirDate: {type: Date, required: true},
   lastAirDate: {type: Date, required: true},
   numberOfEps: {type: Number, required: true},
   numberOfSeasons: {type: Number, required: true},
   createdBy: {type: String, required: true},
 }
```


<br>


## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/profile`             | Saved session                | 200            | 404          | Check if user is logged in and return profile page           |
| POST        | `/auth/signup`                | {name, email, password}      | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                 | {username, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session    |
| POST        | `/auth/logout`                | (empty)                      | 204            | 400          | Logs out the user                                            |
| POST        |`/mediabox/create`              | {id}     | 200| 400| Checks if media is in database and adds it if not there
| GET        | `/mediabox/watchlist`                 |   | 201               | 400          | Show media in watchlist                                              |
| POST      | `/mediabox/media/search`                 |  {search, trending, recommended, genre}                            | 201            | 400          | Filter                                               |     
| GET        |`/mediabox/update/:id`              |      | 200| 400| Updates media in database                                      


<br>


## Links

### Trello/Kanban

[Link to your trello board](https://trello.com/b/xAQKJWNG/mediabox) 

### Git

[Client repository Link](https://github.com/michelleytlock/mediabox)

[Server repository Link](https://github.com/michelleytlock/mediabox-backend)

[Deployed App Link]()

### Slides

[Slides Link]()