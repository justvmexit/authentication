const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

module.exports = ((router, database) => {
    router.get('/science', (req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];

                    res.status(200).json({
                        status: "success",
                        user: {
                            id: user.id,
                            username: user.username,
                            last_login: user.last_login,
                            created_on: user.created_on
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Authentication header not provided."
            });
        }
    });

    router.post('/apps/:id/file', (req, res) => {
        if (req.files.file)
        {
            if(req.headers.authorization)
            {
                database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                    if(error) throw error;

                    if(result.length >= 1)
                    {
                        const user = result[0];
                        database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                            if(error)
                            {
                                throw error;

                                res.status(500).json({
                                    status: "failure",
                                    message: "Internal server error"
                                });
                            }
                            
                            if(result.length >= 1)
                            {
                                const app = result[0];

                                const file = req.files.file;
                                const id = uuid.v4();

                                file.mv(`./modules/${id}`, (error) => {
                                    if(error) throw error;

                                    database.query("UPDATE apps SET file = ? WHERE id = ?", [id, app.id], (error, result, fields) => {
                                        if(error)
                                        {
                                            throw error;
            
                                            res.status(500).json({
                                                status: "failure",
                                                message: "Internal server error"
                                            });
                                        }

                                        res.status(200).json({
                                            status: "success",
                                            message: "Updated file for streaming"
                                        });
                                    });
                                });
                            }
                            else
                            {
                                res.status(404).json({
                                    status: "failure",
                                    message: "App doesn't seem to exist"
                                });
                            }
                        });
                    }
                    else
                    {
                        res.status(403).json({
                            status: "failure",
                            message: "Invalid authentication token"
                        });
                    }
                });
            }
            else
            {
                res.status(400).json({
                    status: "failure",
                    message: "Please provide authentication header."
                });
            }
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Bad Request"
            });
        }
    });

    router.route('/apps').get((req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ?", [user.id], (error, result, fields) => {
                        if(error)
                        {
                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        res.status(200).json({
                            status: "success",
                            apps: result
                        });
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    }).post((req, res) => {
        if(req.body.name)
        {
            if(req.headers.authorization)
            {
                database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                    if(error) throw error;

                    if(result.length >= 1)
                    {
                        const user = result[0];
                        database.query("SELECT * FROM apps WHERE owner = ? AND name = ?", [user.id, req.body.name], (error, result, fields) => {
                            if(error)
                            {
                                throw error;

                                res.status(500).json({
                                    status: "failure",
                                    message: "Internal server error"
                                });
                            }
                            
                            if(result.length == 0)
                            {
                                const app = uuid.v4();
                                database.query("INSERT INTO apps(id, name, owner, version, status) VALUES(?, ?, ?, ?, ?)", [app, req.body.name, user.id, "1.0", 0], (error, result, fields) => {
                                    if(error)
                                    {
                                        throw error;
        
                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error"
                                        });
                                    }

                                    res.status(200).json({
                                        status: "success",
                                        app: app
                                    });
                                });
                            }
                            else
                            {
                                res.status(404).json({
                                    status: "failure",
                                    message: "App already exists"
                                });
                            }
                        });
                    }
                    else
                    {
                        res.status(403).json({
                            status: "failure",
                            message: "Invalid authentication token"
                        });
                    }
                });
            }
            else
            {
                res.status(400).json({
                    status: "failure",
                    message: "Please provide authentication header."
                });
            }
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide name and content request."
            });
        }
    });

    router.get('/apps/:id', (req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                        if(error)
                        {
                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        if(result.length >= 1)
                        {
                            res.status(200).json({
                                status: "success",
                                app: result[0]
                            });
                        }
                        else
                        {
                            res.status(404).json({
                                status: "failure",
                                message: "App doesn't seem to exist"
                            });
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    });

    router.post('/apps/:id/status', (req, res) => {
        if(req.body.status)
        {
            if(req.headers.authorization)
            {
                database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                    if(error) throw error;

                    if(result.length >= 1)
                    {
                        const user = result[0];
                        database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                            if(error)
                            {
                                res.status(500).json({
                                    status: "failure",
                                    message: "Internal server error"
                                });
                            }
                            
                            if(result.length >= 1)
                            {
                                database.query("UPDATE apps SET status = ? WHERE id = ?", [parseInt(req.body.status), req.params.id], (error, result, fields) => {
                                    if(error)
                                    {
                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error"
                                        });
                                    }                                   
                                    
                                    res.status(200).json({
                                        status: "success",
                                        message: "Updated status successfully"
                                    });
                                });
                            }
                            else
                            {
                                res.status(404).json({
                                    status: "failure",
                                    message: "App doesn't seem to exist"
                                });
                            }
                        });
                    }
                    else
                    {
                        res.status(403).json({
                            status: "failure",
                            message: "Invalid authentication token"
                        });
                    }
                });
            }
            else
            {
                res.status(400).json({
                    status: "failure",
                    message: "Please provide authentication header."
                });
            }
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide valid body."
            });
        }
    });

    router.get('/apps/:id/variables', (req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                        if(error)
                        {
                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        if(result.length >= 1)
                        {
                            const app = result[0];

                            database.query("SELECT * FROM variables WHERE app = ?", [app.id], (error, result, fields) => {
                                if(error)
                                {
                                    res.status(500).json({
                                        status: "failure",
                                        message: "Internal server error"
                                    });
                                }

                                res.status(200).json({
                                    status: "success",
                                    variables: result
                                });
                            });
                        }
                        else
                        {
                            res.status(404).json({
                                status: "failure",
                                message: "App doesn't seem to exist"
                            });
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    });

    router.route('/apps/:id/variables').get((req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                        if(error)
                        {
                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        if(result.length >= 1)
                        {
                            const app = result[0];

                            const limit = req.query.limit || 500;
                            if(req.query.search)
                            {
                                database.query("SELECT * FROM variables WHERE app = ? AND name LIKE ? OR content LIKE ? LIMIT ?", [app.id, '%' + req.query.search + '%', '%' + req.query.search + '%', limit], (error, result, fields) => {
                                    if(error)
                                    {
                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error"
                                        });
                                    }
    
                                    res.status(200).json({
                                        status: "success",
                                        variables: result
                                    });
                                });
                            }
                            else
                            {
                                database.query("SELECT * FROM variables WHERE app = ? LIMIT ?", [app.id, limit], (error, result, fields) => {
                                    if(error)
                                    {
                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error"
                                        });
                                    }
    
                                    res.status(200).json({
                                        status: "success",
                                        variables: result
                                    });
                                });
                            }
                        }
                        else
                        {
                            res.status(404).json({
                                status: "failure",
                                message: "App doesn't seem to exist"
                            });
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    }).post((req, res) => {
        if(req.body.name && req.body.content)
        {
            if(req.headers.authorization)
            {
                database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                    if(error) throw error;

                    if(result.length >= 1)
                    {
                        const user = result[0];
                        database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                            if(error)
                            {
                                throw error;

                                res.status(500).json({
                                    status: "failure",
                                    message: "Internal server error"
                                });
                            }
                            
                            if(result.length >= 1)
                            {
                                const app = result[0];

                                database.query("SELECT * FROM variables WHERE name = ?", [req.body.name], (error, result, fields) => {
                                    if(error)
                                    {
                                        throw error;

                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error"
                                        });
                                    }

                                    if(result.length >= 1)
                                    {
                                        database.query("UPDATE variables SET content = ? WHERE name = ?", [req.body.content, req.body.name], (error, result, fields) => {
                                            if(error)
                                            {
                                                throw error;

                                                res.status(500).json({
                                                    status: "failure",
                                                    message: "Internal server error"
                                                });
                                            }

                                            res.status(200).json({
                                                status: "success",
                                                message: "Successfully updated variable."
                                            });
                                        });
                                    }
                                    else
                                    {
                                        database.query("INSERT INTO variables(id, app, name, content) VALUES(?, ?, ?, ?)", [uuid.v4(), app.id, req.body.name, req.body.content], (error, result, fields) => {
                                            if(error)
                                            {
                                                throw error;

                                                res.status(500).json({
                                                    status: "failure",
                                                    message: "Internal server error"
                                                });
                                            }

                                            res.status(200).json({
                                                status: "success",
                                                message: "Successfully created variable."
                                            });
                                        });
                                    }
                                });
                            }
                            else
                            {
                                res.status(404).json({
                                    status: "failure",
                                    message: "App doesn't seem to exist"
                                });
                            }
                        });
                    }
                    else
                    {
                        res.status(403).json({
                            status: "failure",
                            message: "Invalid authentication token"
                        });
                    }
                });
            }
            else
            {
                res.status(400).json({
                    status: "failure",
                    message: "Please provide authentication header."
                });
            }
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide name and content request."
            });
        }
    });

    router.route('/apps/:id/licenses').get((req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                        if(error)
                        {
                            throw error;

                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        if(result.length >= 1)
                        {
                            const app = result[0];

                            const limit = req.query.limit || 500;
                            if(req.query.search)
                            {
                                database.query("SELECT * FROM licenses WHERE app = ? AND license LIKE ? LIMIT ?", [app.id, '%' + req.query.search + '%', parseInt(limit)], (error, result, fields) => {
                                    if(error)
                                    {
                                        throw error;

                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error"
                                        });
                                    }
    
                                    res.status(200).json({
                                        status: "success",
                                        licenses: result
                                    });
                                });
                            }
                            else
                            {
                                database.query("SELECT * FROM licenses WHERE app = ? LIMIT ?", [app.id, parseInt(limit)], (error, result, fields) => {
                                    if(error)
                                    {
                                        throw error;

                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error"
                                        });
                                    }
    
                                    res.status(200).json({
                                        status: "success",
                                        licenses: result
                                    });
                                });
                            }
                        }
                        else
                        {
                            res.status(404).json({
                                status: "failure",
                                message: "App doesn't seem to exist"
                            });
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    }).post((req, res) => {
        if(req.body.duration & req.body.quantity)
        {
            req.body.quantity = parseInt(req.body.quantity);
            req.body.duration = parseInt(req.body.duration);

            if(req.headers.authorization)
            {
                database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                    if(error) throw error;

                    if(result.length >= 1)
                    {
                        const user = result[0];
                        database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                            if(error)
                            {
                                throw error;

                                res.status(500).json({
                                    status: "failure",
                                    message: "Internal server error"
                                });
                            }
                            
                            if(result.length >= 1)
                            {
                                const app = result[0];

                                let generated_licenses = [];
                                for(let i = 0; i < req.body.quantity; i++)
                                {
                                    const key = uuid.v4();
                                    generated_licenses.push(key);
                                }

                                for(let i = 0; i < req.body.quantity; i++)
                                {
                                    database.query("INSERT INTO licenses(id, license, duration, app) VALUES(?, ?, ?, ?)", [uuid.v4(), generated_licenses[i], req.body.duration, app.id], (error, result, fields) => {
                                        if(error)
                                        {
                                            throw error;
                                                    
                                            res.status(500).json({
                                                status: "failure",
                                                message: "Internal server error"
                                            });
                                        }
                                    });
                                }
                                

                                res.status(200).json({
                                    status: "success",
                                    licenses: generated_licenses
                                });
                            }
                            else
                            {
                                res.status(404).json({
                                    status: "failure",
                                    message: "App doesn't seem to exist"
                                });
                            }
                        });
                    }
                    else
                    {
                        res.status(403).json({
                            status: "failure",
                            message: "Invalid authentication token"
                        });
                    }
                });
            }
            else
            {
                res.status(400).json({
                    status: "failure",
                    message: "Please provide authentication header."
                });
            }
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide duration and quantity request."
            });
        }
    });

    router.route('/apps/:id/licenses/:lid').get((req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                        if(error)
                        {
                            throw error;
                            
                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        if(result.length >= 1)
                        {
                            const app = result[0];

                            database.query("SELECT * FROM licenses WHERE app = ? AND id = ?", [app.id, req.params.lid], (error, result, fields) => {
                                if(error)
                                {
                                    throw error;

                                    res.status(500).json({
                                        status: "failure",
                                        message: "Internal server error"
                                    });
                                }

                                if(result.length >= 1)
                                {
                                    res.status(200).json({
                                        status: "success",
                                        license: result[0]
                                    });
                                }
                                else
                                {
                                    res.status(404).json({
                                        status: "failure",
                                        message: "Variable doesn't seem to exist"
                                    });
                                }
                            });
                        }
                        else
                        {
                            res.status(404).json({
                                status: "failure",
                                message: "App doesn't seem to exist"
                            });
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    }).put((req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                        if(error)
                        {
                            throw error;
                            
                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        if(result.length >= 1)
                        {
                            const app = result[0];

                            database.query("SELECT * FROM licenses WHERE app = ? AND id = ?", [app.id, req.params.lid], (error, result, fields) => {
                                if(error)
                                {
                                    throw error;

                                    res.status(500).json({
                                        status: "failure",
                                        message: "Internal server error"
                                    });
                                }

                                if(result.length >= 1)
                                {
                                    database.query("UPDATE licenses SET hwid = ? WHERE id = ?", [null, req.params.lid], (error, result, fields) => {
                                        if(error)
                                        {
                                            throw error;
    
                                            res.status(500).json({
                                                status: "failure",
                                                message: "Internal server error"
                                            });
                                        }
    
                                        res.status(200).json({
                                            status: "success",
                                            message: "Successfully reset HWID."
                                        });
                                    });
                                }
                                else
                                {
                                    res.status(404).json({
                                        status: "failure",
                                        message: "Variable doesn't seem to exist"
                                    });
                                }
                            });
                        }
                        else
                        {
                            res.status(404).json({
                                status: "failure",
                                message: "App doesn't seem to exist"
                            });
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    }).delete((req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                        if(error)
                        {
                            throw error;
                            
                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        if(result.length >= 1)
                        {
                            const app = result[0];

                            database.query("SELECT * FROM licenses WHERE app = ? AND id = ?", [app.id, req.params.lid], (error, result, fields) => {
                                if(error)
                                {
                                    throw error;

                                    res.status(500).json({
                                        status: "failure",
                                        message: "Internal server error"
                                    });
                                }

                                if(result.length >= 1)
                                {
                                    database.query("DELETE FROM licenses WHERE id = ?", [req.params.lid], (error, result, fields) => {
                                        if(error)
                                        {
                                            throw error;
    
                                            res.status(500).json({
                                                status: "failure",
                                                message: "Internal server error"
                                            });
                                        }
    
                                        res.status(200).json({
                                            status: "success",
                                            message: "Successfully deleted license."
                                        });
                                    });
                                }
                                else
                                {
                                    res.status(404).json({
                                        status: "failure",
                                        message: "Variable doesn't seem to exist"
                                    });
                                }
                            });
                        }
                        else
                        {
                            res.status(404).json({
                                status: "failure",
                                message: "App doesn't seem to exist"
                            });
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    });

    router.delete('/apps/:id/variables/:vid', (req, res) => {
        if(req.headers.authorization)
        {
            database.query("SELECT * FROM users WHERE token = ?", [req.headers.authorization], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const user = result[0];
                    database.query("SELECT * FROM apps WHERE owner = ? AND id = ?", [user.id, req.params.id], (error, result, fields) => {
                        if(error)
                        {
                            throw error;
                            
                            res.status(500).json({
                                status: "failure",
                                message: "Internal server error"
                            });
                        }
                        
                        if(result.length >= 1)
                        {
                            const app = result[0];

                            database.query("SELECT * FROM variables WHERE app = ? AND id = ?", [app.id, req.params.vid], (error, result, fields) => {
                                if(error)
                                {
                                    throw error;

                                    res.status(500).json({
                                        status: "failure",
                                        message: "Internal server error"
                                    });
                                }

                                if(result.length >= 1)
                                {
                                    database.query("DELETE FROM variables WHERE id = ?", [req.params.vid], (error, result, fields) => {
                                        if(error)
                                        {
                                            throw error;

                                            res.status(500).json({
                                                status: "failure",
                                                message: "Internal server error"
                                            });
                                        }

                                        res.status(200).json({
                                            status: "success",
                                            message: "Successfully deleted variable."
                                        });
                                    });
                                }
                                else
                                {
                                    res.status(404).json({
                                        status: "failure",
                                        message: "Variable doesn't seem to exist"
                                    });
                                }
                            });
                        }
                        else
                        {
                            res.status(404).json({
                                status: "failure",
                                message: "App doesn't seem to exist"
                            });
                        }
                    });
                }
                else
                {
                    res.status(403).json({
                        status: "failure",
                        message: "Invalid authentication token"
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Please provide authentication header."
            });
        }
    });
});