require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req,res, next) => {
//     console.log(req.originalUrl);
//     return res.sendStatus(200)
// })

const posts = [
    {
        "name":"post 1",
        "username":"sam",
        "content": "Hello world"
    },
    {
        "name":"post 2",
        "username":"marco",
        "content": "Ciao mondo"
    }
]

app.post("/login", (req,res)=>{
    console.log("Login request");
    const username = req.body.username;
    const password = req.body.password;

    const user = {name: username, password: password}

    const token = genToken(user);
    res.json({
        "access_token": token,
        "token_type": "bearer",
        "expires_in": 31535999,
        "scope": "read trust write"
      })
});

app.get('/projects', auth, (req,res)=>{
    console.log("projects");
    return res.sendStatus(200);
})




function auth(req,res,next){
    const authHeader = req.headers['authorization'];

    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);

        req.user = user;
        next();    
    });

}

function genToken(user){
    return jwt.sign(user,process.env.JWT_SECRET, {expiresIn:'5s'});
}


app.listen(3000);
