const express = require('express');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const config = require('./config.json');

const app = express();
const auth = express.Router();
const client = express.Router();
const admin = express.Router();

app.use(bodyparser.json({limit: '25mb'}));
app.use(bodyparser.urlencoded({extended: true, limit: '25mb'}));
app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use((req, res, next) => {
    res.set('X-Powered-By', 'deez nutz nigga');
    req.ip = req.get('CF-Connecting-Ip') || req.ip; // Cloudflare support

    console.log('%s request from %s to %s', req.method, req.ip, req.path);

    next();
});

app.use('/backend/dashboard/api/v1', admin);
app.use('/backend/auth/api/v1', auth);
app.use('/backend/client/api/v1', client);


app.listen(config.port, () => {
    console.log('started listening %d', config.port);

    const database = require('./database')(config);

    require('./admin')(admin, database);
    require('./auth')(auth, database);
    require('./api')(client, database);
});