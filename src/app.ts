import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;
const apiRouter = require('./api/index');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());

// Use API routes
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})