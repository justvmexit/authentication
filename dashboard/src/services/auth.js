exports.login = (async (component, credentials) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/auth/api/v1/login`, {
        method: 'POST', 
        body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();
    if(result.status == "success")
    {
        component.$store.state.token = result.token;
        component.$store.state.loggedIn = true;
        return true;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.register = (async (component, credentials) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/auth/api/v1/register`, {
        method: 'POST', 
        body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();
    if(result.status == "success")
    {
        return true;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});