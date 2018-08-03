const express = require('express');
const path = require('path');
const routes = require('./routes');

const CONFIG = require('./config');

const app = express();

//  Connect all routes to the application
app.use('/', routes);

app.listen(CONFIG.PORT, () => console.log(`App listening on port ${CONFIG.PORT}!`));
