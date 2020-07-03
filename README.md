# MediaBox

<br>

## Description

MediaBox is an app that provides users with recommendations on what movies and tv shows to watch, based on users' preferences and ratings.

## Core Features

- Rate movies/tv shows
- See personalised recommendations on things to watch
- Add movies/tv shows to a watchlist
- Search for specific movies/tv shows/or people
- See details about specific movies/tv shows
- See rating and genre stats on profile

## User Stories

- **Landing:** As a new user, I want to know I am at the right place by seeing the app’s name and logo and a brief introduction of the app.
- **404:** As an anon/user I can see a 404 page if I try to go to a page that does not exist so I know to go back.
- **Signup:** As an anon/user, I can see a sign up form so that I can make my own user profile to get access to the app.
- **Login:** As an anon/user, I can log in so I can continue using the app.
- **Logout:** As a user, I can log out of the platform so others will not have access to it on the same device.
- **Onboarding:** As a user, in order to build a database for the app so that it can provide more relavant recommendations, I will go through an initial onboarding flow of rating at least 10 random movies/tv shows so that the app can immediately start recommending things to watch based on my preferences.
- **Discover:** As a user, I can find a recommended movie/tv show, and depending on whether I’ve seen it or not, add a rating, add to my watchlist, or skip it. Also, I am able to search for specific content, and filter by trending.
- **Watchlist:** As a user, I can find movies/tv shows I have previously saved to my watchlist, things that I haven’t seen yet but want to in the future.
- **Profile:** As a user, I can see all the ratings I’ve ever given and filter through those and stats about genres I watch.
- **Media Details:** As a user, I can see details about a specific movie or tv show, like how many episodes there are, the genre, who is in it or who is the director.

## Backlog

- Add a tutorial onboarding
- Swiping animation, transition animations
- Add reviews to each media
- Add social functionality - see movies/tv shows friends have rated, their ratings, their recommendations, messaging

<br>

# Client / Frontend

## React Router Routes (React App)

| Path              | Component     | Permissions                | Behavior                                                                                       |
| ----------------- | ------------- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| `/`               | LandingPage   | public `<Route>`           | Landing page about the app                                                                     |
| `/signup`         | SignupPage    | anon only `<AnonRoute>`    | Signup form, link to login, redirect to Home after                                             |
| `/login`          | LoginPage     | anon only `<AnonRoute>`    | Login form, link to signup, redirect to Home after                                             |
| `/home`           | Intro         | user only `<PrivateRoute>` | If first time logging on, rate 10 movies and 10 tv shows to begin. Otherwise, will be homepage |
| `/:mediaType/:id` | MediaDetails  | user only `<PrivateRoute>` | Show details about the movie or tv show                                                        |
| `/watchlist`      | Watchlist     | user only `<PrivateRoute>` | Show movies and tv shows on watchlist                                                          |
| `/profile`        | Profile       | user only `<PrivateRoute>` | Check profile with stats, rating history                                                       |
| `/search`         | SearchResults | user only `<PrivateRoute>` | See search results                                                                             |
| `/person`         | PersonDetails | user only `<PrivateRoute>` | See details about person                                                                       |

## Components

- LandingPage

- SignupPage

- LoginPage

- Intro

- Onboarding

- OnboardingRater

- Navbar

- Home

- HomeRater

- Filter

- MediaFilter

- Watchlist

- MediaDetails

- PersonDetails

- List

- Profile

- SearchResults

- PrivateRoute

## Services

- Auth Service

  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.checkUsername(username)
  - auth.checkEmail(email)

- MediaBox Service

  - user.data // get user model updated list
  - user.logOut() // log out
  - user.delete() // delete user account
  - user.watchlist() // get user's watchlist
  - media.search // search
  - media.rate(id) // (add to user model's list, with listType "rated" and rating)
  - media.skip(id) // (add to user model's list, with listType "skipped")
  - media.save(id) // (add to user model's list, with listType "watchlist")
  - media.getDetails(id) // get details about movie/tv show
  - profile.getGenres() // get genres from user model's list
  - profile.addProfilePic() // add profile pic to user model

- External API
  - api.random()
  - api.trending()

<br>

# Server / Backend

## Models

User model

```javascript
{
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  list: [{mediaId: {type: Schema.Types.ObjectId,ref:'Media'}, apiId: Number, mediaType: String, listType: String, rating: Number}], profileImg: String
}
```

Media model

```javascript
 {
   apiId: {type: Number, required: true},
   mediaType: {type: String, required: true},
   title: {type: String, required: true},
   description: {type: String, required: true},
   image: {type: String, required: true},
   genres: [Number],
   tagline: String,
   releaseDate: Date,
   runtime: Number,
   director: String,
   firstAirDate: Date,
   lastAirDate: Date,
   numberOfEps: Number,
   numberOfSeasons: Number,
   createdBy: String,
 }
```

<br>

## API Endpoints (backend routes)

| HTTP Method | URL                      | Request Body                           | Success status | Error Status | Description                                                                                                                     |
| ----------- | ------------------------ | -------------------------------------- | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| POST        | `/auth/signup`           | {name, email, password}                | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`            | {username, password}                   | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session              |
| GET        | `/auth/logout`           | (empty)                                | 204            | 400          | Logs out the user                                                                                                               |
| GET        | `/auth/user`           | (empty)                                | 204            | 400          | Gets user from session                                                                                                               |
| GET        | `/auth/userData`           | (empty)                                | 204            | 400          | Gets user data from user model with updated data                                                                                                               |
| GET        | `/auth/checkUsername`           | (empty)                                | 204            | 400          | Used during signup flow input changes, checks whether username exists                                                                                                               |
| GET        | `/auth/checkEmail`           | (empty)                                | 204            | 400          | Used during signup flow input changes, checks whether email exists                                                                                                               |
| POST        | `/mediabox/create`       | {id}                                   | 200            | 400          | Checks if media is in media model and adds it if not there, checks if media is in user model's list and adds it if not there                                                                         |
| GET         | `/mediabox/watchlist`    | {id}                                       | 201            | 400          | Show media in watchlist                                                                                                         |
| GET        | `/mediabox/getDetails/:mediaType/:id` | {mediaType, id} | 201            | 400          | External api calls to get movie/tv show and to get its credits (must be done on server side due to external api requirements)                                                                                                                          |
| GET         | `/mediabox/getGenres`   |                                        | 200            | 400          | External api call to get all genre information                                                                                                       |
| DELETE         | `/mediabox/user`   |  {id}                                      | 200            | 400          | Delete user from user collection                                                                                                       |
| PATCH         | `/mediabox/update/:id`   |                                        | 200            | 400          | Update with correct listType                                                                                                       |
| PATCH         | `/mediabox/editProfile`   |                                        | 200            | 400          | Add profile picture to user model                                                                                                       |

<br>

## Links

### Trello/Kanban

[Link to your trello board](https://trello.com/b/xAQKJWNG/mediabox)

### Git

[Client repository Link](https://github.com/michelleytlock/mediabox)

[Server repository Link](https://github.com/michelleytlock/mediabox-backend)

[Deployed App Link](https://media-box.herokuapp.com/)

### Slides

[Slides Link](https://docs.google.com/presentation/d/1Pnulgijkh8MidybunoM268vNpeBq0q1yofVz4y471oU/edit?usp=sharing)
