# Rain Race

A passive multiplayer game that uses your location and current weather data to collect rain fall.
Current build uses express and plain html.

## Setup

Install packages for the app:

```
npm run setup
```

Run below script to start app.

```
npm start
```

Client will run on http://localhost:5173

## Limitations

There are foundational design decisions I regret from the start of this project. I began with just a server and plain HTML but pivoted to using a React client to manage some logic.

On a redo, I would organize the project structure so that the app was made of a server folder with its own package.json instead of the server using the root package.json, just to avoid an weird dependency conflicts but also to make it a bit easier to dockerize should the prototype move forward. I couldn't get npm workspaces working but with a bit more time would spend it on making sure the organization was more intentional. To add on top of that, I would have preferred the shared interfaces be placed in a "common" package for easy access for client and server so I didn't need to edit it in two places.

As a prototype it fulfills most of the requirements but it has a few issues that need longer term fixes:

1. In memory user data will get wiped on restart of server.
2. I am frequently using 3 APIs to call for weather, geoIP, and geo coordinates. Managing calls with rate limits will be necessary.
3. SSE update the clients but seems to be a bit unreliable. Moving to something like Colyseus or WebSockets may be better.
4. There are a lot of places that need guarding against bad API calls, duplicate usernames, and better input cleaning.

### User Authentication

To add user authentication, I would use JWT.

1. Complete AuthForm component and use it instead of JoinForm.
2. Add API routes for login and register.
3. Add logic for the login and register controllers.
4. Add middleware with express-jwt to verify token.
5. Require auth for updating location, heartbeat and offline.

### Database for User Data

Authentication would require the use of a persistent data layer. We could use a database to store username, password

Maybe caching a day's forecast in a cache like Redis would be better. We can also cache rain data for specific cities and update all users with that rain data rather than request for every user.

### CSS

As a bonus, using the React app makes it straight forward for making CSS changes. I would probably move towards using Tailwind because it is straightforward in implementation. Using Vite with React allows for an easy install process:

https://tailwindcss.com/docs/installation/using-vite
