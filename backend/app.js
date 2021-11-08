const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const config = require('./config.json');

const app = express();
const auth = express.Router();
const client = express.Router();
const admin = express.Router();
const payments = express.Router();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors());
app.use((req, res, next) => {
    res.set('X-Powered-By', 'deez nutz nigga');
    req.ip = req.get('CF-Connecting-Ip') || req.ip; // Cloudflare support

    console.log('%s request from %s to %s', req.method, req.ip, req.path);

    next();
});


app.use('/backend/dashboard/api/v1', admin);
app.use('/backend/auth/api/v1', auth);

app.listen(config.port, () => {
    console.log('started listening %d', config.port);

    const database = require('./database')(config);

    require('./admin')(admin, database);
    require('./auth')(auth, database);
});