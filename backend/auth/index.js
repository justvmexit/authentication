const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('uuid');

module.exports = ((router, database) => {
    router.post('/login', (req, res) => {
        if(req.body.username && req.body.password)
        {
            database.query("SELECT * FROM users WHERE username = ?", [req.body.username], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];

                    const passwordValid = bcrypt.compareSync(req.body.password, user.password);
                    if(passwordValid)
                    {
                        res.status(200).json({
                            status: "success",
                            token: user.token
                        });
                    }
                    else
                    {
                        res.status(403).json({
                            status: "failure",
                            message: "Those credentials don't match our records."
                        });
                    }
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Those credentials don't match our records."
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Invalid parameters provided."
            });
        }
    });

    router.post('/register', (req, res) => {
        if(req.body.username && req.body.password)
        {
            database.query("SELECT * FROM users WHERE username = ?", [req.body.username], (error, result, fields) => {
                if(error) throw error;

                if(result.length == 0)
                {
                    if(req.body.username.length <= 255 && req.body.password.length <= 255)
                        {
                            bcrypt.hash(req.body.password, 12, (error, data) => {
                                if(error) throw error;

                                database.query("INSERT INTO users(id, username, password, token) VALUES(?, ?, ?, ?)", [uuid.v4(), req.body.username, data, crypto.randomBytes(64).toString('hex')], (error, result, fields) => {
                                    if(error) throw error;

                                    if(result.affectedRows >= 1)
                                    {
                                        res.status(200).json({
                                            status: "success",
                                            message: "Succcessfully registered"
                                        });
                                    }
                                    else
                                    {
                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error."
                                        });
                                    }
                                });
                            });
                    }
                    else
                    {
                        res.status(400).json({
                            status: "failure",
                            message: "Invalid username."
                        });
                    }
                }
                else
                {
                    res.status(400).json({
                        status: "failure",
                        message: "User already seems to exist."
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Invalid parameters provided."
            });
        }
    });
});