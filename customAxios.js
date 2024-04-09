const axios = require("axios");

const getToken = async (username, password) => {
    return await axios.post('http://localhost:3000/login', {
        "username":username,
        "password":password
    });
}

const getInstance = async (username, password) => {
    const token = await getToken(username,password);
    const instance = axios.create({
        baseURL:"http://localhost:3000",
            timeout:2000,
            headers: {
               'Accept': 'application/json',  
               'Content-Type':'application/json'     ,
               'Authorization':`Bearer ${token.data.access_token}`         
            }
    })

    instance.interceptors.response.use( response => response, 
        async (error) => {
            if(error.response && (error.response.status === 401 || error.response.status === 403)){
                try{
                    const newToken = await getToken(username,password)

                    error.config.headers['Authorization'] = `Bearer ${newToken.data.access_token}`

                    return instance(error.config)

                }catch(err){
                    throw err
                }
            }
            return Promise.reject(error)
    })

    return instance
}

module.exports = getInstance