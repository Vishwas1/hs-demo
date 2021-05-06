const express =  require('express')
const HypersignAuth = require('hypersign-auth-js-sdk')
const https = require('https');
const cors = require('cors');
const path = require('path');
const fs = require('fs')
const httpsLocalhost = require("https-localhost")()




httpsLocalhost.getCerts().then(certs => {


    const app =  express();
    const server = new https.createServer(certs, app);
    
    const hypersign = new HypersignAuth(server);
    const port = 3003;
    
    
    
    app.use(cors())
    app.use(express.static('public'))
    app.use(express.json());
    
    app.get("/secured", (req, res) => {
        res.send("Hi. This is secured")
    })
    
    
    
    // Implement /hs/api/v2/auth API 
    app.post('/hs/api/v2/auth', hypersign.authenticate.bind(hypersign), (req, res) => {
        try {
            const user = req.body.hsUserData;
            // Do something with the user data.
            res.status(200).send({ status: 200, message: "Success", error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    })
    
    // app.post('/hs/api/v2/auth',(req, res) => {
    //     try {
    //         console.log(req.body)
    //         // const user = req.body.hsUserData;
    //         // Do something with the user data.
    //         res.status(200).send({ status: 200, message: "Success", error: null });
    //     } catch (e) {
    //         res.status(500).send({ status: 500, message: null, error: e.message });
    //     }
    // })
    
    // Implement /register API: 
    // Analogous to register user but not yet activated
    app.post('/hs/api/v2/register', hypersign.register.bind(hypersign), (req, res) => {
        try {
            console.log(req.body)
            console.log('Register success');
            // You can store userdata (req.body) but this user is not yet activated since he has not 
            // validated his email.
            res.status(200).send({ status: 200, message: "Success", error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    })
    
    // Implement /credential API: 
    // Analogous to activate user
    app.get('/hs/api/v2/credential', hypersign.issueCredential.bind(hypersign), (req, res) => {
        try {
            console.log('Credential success');
            // Now you can make this user active
            res.status(200).send({ status: 200, message: req.body.verifiableCredential, error: null });
        } catch (e) {
            res.status(500).send({ status: 500, message: null, error: e.message });
        }
    })
    
    // Unprotected resource, may be to show login page
    app.get('/protected', hypersign.authorize.bind(hypersign) ,function(req, res) {
        try {
            const user = req.body.userData;
            // Do whatever you want to do with it
            // Send a message or send to home page
            res.status(200).send("I am protected by Hypersign authentication");
        } catch (e) {
            res.status(500).send(e.message)
        }
    });
    
    
    // Unprotected resource, may be to show login page
    app.get('/', function(req, res) {
        res.sendFile('/index.html');
    });
    
    app.get('/register', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/register.html'));
    });
    
    server.listen(port, () => {
        console.log('Server is listing at port = ' + port)
    })


})
// const options = {
//     key: fs.readFileSync("key.pem"),
//     cert: fs.readFileSync("cert.pem")
// }
