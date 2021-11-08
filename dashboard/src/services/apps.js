exports.getApps = (async (component) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        return result.apps;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.getApp = (async (component, id) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        return result.app;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.getVariables = (async (component, id) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${id}/variables?limit=50`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        return result.variables;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.searchVariables = (async (component, id, search) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${id}/variables?limit=50&search=${search}`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        return result.variables;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.searchLicenses = (async (component, id, search) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${id}/licenses?limit=50&search=${search}`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        return result.licenses;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.getLicenses = (async (component, id) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${id}/licenses?limit=50`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        return result.licenses;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});


exports.newVariables = (async (component, id, name, content) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${id}/variables`, {
        method: 'POST',
        body: JSON.stringify({
           name: name,
           content: content 
        }),
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        component.$toast.success(result.message);
        return true;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.deleteVariable = (async (component, app, id) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${app}/variables/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        component.$toast.success(result.message);
        return true;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.generateLicenses = (async (component, id, duration, quantity) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${id}/licenses`, {
        method: 'POST',
        body: JSON.stringify({
            duration: duration,
            quantity: quantity 
        }),
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        return result.licenses;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.deleteLicense = (async (component, app, id) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${app}/licenses/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        component.$toast.success(result.message);
        return true;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.resetHWID = (async (component, app, id) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${app}/licenses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        component.$toast.success(result.message);
        return true;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});

exports.updateStatus = (async (component, id, status) => {
    const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/apps/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({
           status: status,
        }),
        headers: {
            'Content-Type': 'application/json',
            'authorization': component.$store.state.token
        }
    });
    
    const result = await response.json();

    if(result.status == "success")
    {
        component.$toast.success(result.message);
        return true;
    }
    else
    {
        component.$toast.error(result.message);
        return false;
    }
});