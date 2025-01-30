import express from 'express';
import path from 'path';
import apiRouter from './api/index';
import {updateWeather} from './api/controllers/users';
import {users} from './api/controllers/users';

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());

// Use API routes
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})

// Set interval to update weather and add rainfall to player score
setInterval(() => {
  users.forEach((user) => {
    if (user.isOnline) {
      updateWeather(user);
    }
  });
}, 60000)