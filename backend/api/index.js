const uuid = require('uuid');

module.exports = ((router, database, config) => {
    router.get('/module', (req, res) => {
        if(req.query.token)
        {
            database.query("SELECT * FROM sessions WHERE token = ?", [req.query.token], (error, result, fields) => {
                if(error) throw error;

                if(result.length >= 1)
                {
                    const session = result[0];
                    database.query("SELECT * FROM apps WHERE id = ?", [session.app], (error, result, fields) => {
                        if(error) throw error;

                        if(result.length >= 1)
                        {
                            const app = result[0];

                            if(app.file != null && require('fs').existsSync(`./modules/${app.file}`))
                            {
                                let key = 0;
                                for(let iterator = 0; iterator < session.license.length; iterator++)
                                {
                                    key += session.license.charCodeAt(iterator) // xor for life baby
                                }

                                var image_data = require('fs').readFileSync(`./modules/${app.file}`);
                                var new_image = []

                                for(let i = 0; i < image_data.length; i++)
                                {
                                    new_image[i] = image_data[i] ^ key;
                                }

                                database.query("DELETE FROM sessions WHERE id = ?", [session.id], (error, result, fields) => {
                                    if(error) throw error;

                                    console.log(result)

                                    if(result.affectedRows >= 1)
                                    {
                                        res.status(200).json({
                                            status: "success",
                                            image: new_image
                                        });
                                    }
                                    else
                                    {
                                        res.status(500).json({
                                            status: "failure",
                                            message: "Internal server error"
                                        });
                                    }
                                });
                            }
                            else
                            {
                                res.status(400).json({
                                    status: "failure",
                                    message: "No file associated with app."
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
                    res.status(404).json({
                        status: "failure",
                        message: "Invalid session token provided."
                    });
                }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Invalid parameters"
            });
        }
    });

    router.post('/authenticate', (req, res) => {
      if(req.body.license && req.body.token)
      {
        database.query("SELECT * FROM licenses WHERE license = ?", [req.body.license], (error, result, fields) => {
            if(error) throw error;

            if(result.length >= 1)
            {
                const license = result[0];

                if(!license.hwid || license.hwid == "")
                {
                    database.query("UPDATE licenses SET hwid = ? WHERE id = ?", [req.body.token, license.id], (error, updateResult, fields) => {
                        if(error) throw error;

                        res.status(200).json({
                            status: "retry",
                            message: "Restart auth process"
                        });
                    });
                }

                else if(license.hwid == req.body.token)
                {
                    if(license.expiry == "0000-00-00 00:00:00" || !license.expiry)
                    {
                        const new_expiry = new Date();
                        new_expiry.setDate(new_expiry.getDate() + license.duration);
                        database.query("UPDATE licenses SET expiry = ? WHERE id = ?", [new_expiry, license.id], (error, result, fields) => {
                            if(error) throw error;
                           
                            if(result.affectedRows >= 1)
                            {
                                res.status(200).json({
                                    status: "retry",
                                    message: "Restart auth process"
                                });
                            }
                        });
                    }
                    else
                    {
                        const current_date = new Date();
                        if(current_date <= new Date(license.expiry))
                        {
                            const token = require('crypto').randomBytes(64).toString('hex');
                            database.query("INSERT INTO sessions (id, license, app, token) VALUES(?, ?, ?, ?)", [uuid.v4(), req.body.license, license.app, token], (error, sessionResult, fields) => {
                                if(error) throw error;

                                if(sessionResult.affectedRows >= 1)
                                {
                                    database.query("SELECT * FROM apps WHERE id = ?", [license.app], (error, result, fields) => {
                                        if(error) throw error;

                                        if(result.length >= 1)
                                        {
                                            const app = result[0];

                                            res.status(200).json({
                                                status: "success",
                                                license: license,
                                                token: token,
                                                app: {
                                                    id: app.id,
                                                    name: app.name,
                                                    version: app.version,
                                                    status: app.status,
                                                    created_on: app.created_on
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
                            })
                        }
                        else
                        {
                            res.status(401).json({
                                status: "failure",
                                message: "That license has been expired."
                            });
                        }           
                    }    
                }
                else
                {
                    res.status(401).json({
                        status: "failure",
                        message: "The hardware id doesn't match."
                    });
                }
            }
            else
            {
                res.status(404).json({
                    status: "failure",
                    message: "That license doesn't seem exist"
                })
            }
        });
      }
      else
      {
        res.status(400).json({
            status: "failure",
            message: "Internal client error"
        });
      }
    });

    router.get('/variables/:id', (req, res) => {
        if(req.query.license)
        {
          database.query("SELECT * FROM licenses WHERE license = ?", [req.query.license], (error, result, fields) => {
              if(error) throw error;
  
              if(result.length >= 1)
              {
                  const license = result[0];
                  const current_date = new Date();
                  if(current_date <= new Date(license.expiry))
                  {
                      database.query("SELECT * FROM variables WHERE id = ? AND app = ?", [req.params.id, license.app], (error, result, fields) => {
                        if(error) throw error;

                        if(result.length >= 1)
                        {
                            res.status(200).json({
                                status: "success",
                                variable: {
                                    name: result[0].name,
                                    content: result[0].content
                                }
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
                    res.status(401).json({
                        status: "failure",
                        message: "This license has expired."
                    })
                  }
              }
              else
              {
                  res.status(404).json({
                      status: "failure",
                      message: "That license doesn't seem exist"
                  })
              }
            });
        }
        else
        {
            res.status(400).json({
                status: "failure",
                message: "Internal client error"
            });
        }
    });
});