const express = require('express');
const cors = require('cors');
const routes = require('./routes.js');

const cookieParser = require('cookie-parser')
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  })
);

require('./database/index.js');
app.use(cookieParser())
app.use(routes);

app.listen(8081, () => {
  console.log('running');
});