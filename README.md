# More Than Words


<br>

## Description

This is an app that generates random quotes on three genres, and creates a Spotify playlist based on the words of a quote.

## User Stories

-  **404:** As a user I get to see a 404 page with a feedback message if I try to reach a page that does not exist.
-  **Signup:** As an anonymous user I can sign up on the platform so that I can start reading and adding quotes to my favorites.
-  **Login:** As a user I can login to the platform so that I can access my profile, get new quotes and check my favorite quotes.
-  **Logout:** As a logged in user I can logout from the platform.
-  **Profile Page**: As a logged in user I can visit my profile page so that I can access the edit page and see or update my personal details. This is also where I can logout.
-  **Get Random Quotes** As a logged in user I can get random quotes, based on the three quote genres (inspire, funny, and art).
-  **Add Quotes to Favorites:** As a logged in user I can add quotes to my favorites list.
-  **Delete Favorites:** As a logged in user I can delete quotes from my favorites list.
-  **Search Quotes:** As a logged in user I can search for quotes based on keywords I choose.
-  **Generate Playlist:** As a looged in user I can generate a Spotify playlist based on the words of a quote.
-  **Add Playlist:** As a logged in user I want to connect to my Spotify account so I can save the playlist generated on the platform.



<br>


# Client / Frontend

## React Router Routes (React App)

| Path                         | Component            | Permissions                | Behavior                                                  |
| ---------------------------- | -------------------- | -------------------------- | --------------------------------------------------------- |
| `/login`                     | LoginPage            | anon only `<AnonRoute>`    | Login form, navigates to home page after login.           |
| `/signup`                    | SignupPage           | anon only  `<AnonRoute>`   | Signup form, navigates to home page after signup.         |
| `/`                          | HomePage             | public `<Route>`           | Home page.                                                |
| `/user-profile`              | ProfilePage          | user only `<PrivateRoute>` | User and player profile for the current user.             |
| `/user-profile/edit`         | EditProfilePage      | user only `<PrivateRoute>` | Edit user profile form.                                   |
| `/quote/:quoteId`           | QuoteDetailsPage                               |user only `<PrivateRoute>` | Quote details.
| `/quote/favorites`               | FavoriteQuotesPage   | user only `<PrivateRoute>` | Favorite quotes list.                                         |
| `/quote/search` | QuotesSearchPage | user only `<PrivateRoute>` | Search quotes form. |
| `/quote/playlist/:playlistId`    | PlaylistPage    | user only `<PrivateRoute>` | Playlist details.                                    |
| `/welcome`    | WelcomePage         | user only `<PrivateRoute>` | Welcome user on first loggin.                                 |




## Components

Pages:

- LoginPage
- SignupPage
- WelcomePage
- HomePage
- ProfilePage
- EditProfilePage
- QuoteDetailsPage
- FavoriteQuotesPage
- QuotesSearchPage
- PlaylistPage

<br>
  

Components:

- Navbar
- QuoteCard
- PlaylistCard
- Anon
- Private









## Services

- **Auth Service**

  - `authService` :
    - `.login(user)`
    - `.signup(user)`
    - `.logout()`
    - `.validate()`

- **User Service**

  - `userService` :
    - `.updateCurrentUser(id, userData)`
    - `.getCurrentUser()`

- **Favorites Service**

  - `favoritesService` :
    - `.addFavorites(favoritesData)`
    - `.getFavorites()`
    - `.getOneQuote(id)`
    - `.deleteOneQuote(id)`



  



<br>


# Server / Backend


## Models

**User model**

```javascript=
function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

{
  username: {
      type: String, required: true, unique: true, trim: true
  }  
  email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true, 
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Please use a valid email address',],
  }
  firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      set: capitalize,
  },
  lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      set: capitalize,
  },
      
  password: { type: String, required: true },
      
  profileImg: {
      type: String,
      default: 'https://res.cloudinary.com/dvzekm9zq/image/upload/v1660147231/cards/avatar_bpem8o.png',
    },
        
  favoriteQuotes: [{ type: Schema.Types.ObjectId, ref:'Quote' }],
}
```



**Quote model**

```javascript
 {
   {
  _id: {type: String,},
  // The quotation text
  content: {type: string},
  // The full name of the author
  author: {type: String},
  // The length of quote (number of characters)
  minLength: {type: Number},
  // An array of tag names for this quote
  maxLength: {type: Number},
      // An array of tag names for this quote
  tags: {type: String} //tags available('famous-quotes', 'inspirational', 'wisdom')
  playlist: [{ type: Schema.Types.ObjectId, ref: 'Playlist'}]
 }
     
```



**Playlist model**

```javascript
{
  playlist_id: {type: String,},

}
```




<br>


## API Endpoints (backend routes)

| HTTP Method | URL                    | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | ---------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/verify    `    | Saved session                | 200            | 404          | Check if user is logged in and return profile page           |
| POST        | `/auth/signup`         | {name, email, password}      | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`          | {username, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`         |       { - - - }                       | 204            | 400          | Logs out the user                                            |
| GET         | `/`     | { - - - }                             |                | 400          | Get root                                         |
| POST         | `/api/user/` |   { - - - }                           |                |              | Create profile                                     |
| GET        | `/api/user:id`     | { - - -  }       | 201            | 400          | Get profile details                             |
| PUT         | `/api/user/:id` | { - - - }       | 200            | 400          | edit profile                                              |
| DELETE      | `/api/user/:id` |  { - - - }                            | 201            | 400          | delete profile                                            |
| GET         | `/api/quote/random/tag/`     |   { - - - }                           |                |              | get random quote                                         |
| GET        | `/api/quote/search/`         | { - - - }  | 200            | 404          | search all quotes                                                   |
| GET         | `/api/quote/:id`     | { - - - }                | 201            | 400          | get quote details                                                  |
| GET     | `/api/favorites/:id`     | { - - - }                             | 200            | 400          | show favorites list                                               |
| PUT         | `/api/favorites/:id`           | { - - - }                             | 201            | 400          | edit item in favorites                                                   |
| DELETE         | `/api/favorites/:id`       |    { - - - }                          |                |              | delete item from favorites                                           |
| GET        | `/api/playlist`           | { - - - } |                |              | add game                                                     |



<br>

## API's

* [Quotable](https://github.com/lukePeavey/quotable)
* [Spotify](https://developer.spotify.com/documentation/web-api/)

<br>

## Packages

* Ironlauncher
* Tailwind CSS
* React Router DOM
* Axios
* bcryptjs
* jsonwebtoken
* express-jwt 

<br>


## Links

### Trello

[Quote My Music trello board](https://trello.com/invite/b/2XkT9d89/36d06f485de4829213831909a96ce87e/quote-my-music)

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/screeeen/project-client)

[Server repository Link](https://github.com/screeeen/project-server)

[Deployed App Link](http://heroku.com)

### Slides

[Slides Link](http://slides.com) - The url to your *public* presentation slides

### Contributors

Miguel Nogueira - [GitHub](https://github.com/tomarnogueiracoding) - [LinkedIn](https://www.linkedin.com/in/migueltomarnogueira/)
