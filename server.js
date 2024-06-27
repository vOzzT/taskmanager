const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url =
    'mongodb+srv://API:L81XKZO9TXSI9D3U@cardlab.no38z0r.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    var error = '';
    const { login, password } = req.body;
    const db = client.db('COP4331');
    const results = await
        db.collection('Users').find({ Login: login, Password: password }).toArray();
    var id = -1;
    var fn = '';
    var ln = '';
    if (results.length > 0) {
        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }
    var ret = { id: id, firstName: fn, lastName: ln, error: '' };
    res.status(200).json(ret);
});

app.post('/api/signup', async (req, res, next) => {
    // incoming: firstname, lastname, login, password, email, phone
    // outgoing: id, firstName, lastName, error

    var error = '';
    
    const { login, password, firstname, lastname, phone, email } = req.body;

    let newUser = { Login: login, Password: password, FirstName: firstname, LastName: lastname, Phone: phone, Email: email };

    const db = client.db('COP4331');

    //Checks to see if login or email is taken
    const loginExists = await db.collection('Users').findOne({Login: req.body.login});
    const emailExists = await db.collection('Users').findOne({Email: req.body.email});

    if ( (loginExists && emailExists)){

        console.log("User " + login + " and email " + email + " already exist!");
        return res.status(409).send("Login and email already exist");

    } else if (emailExists){

        console.log("Email " + email + " already exists!");
        return res.status(409).send("Email already exists");

    } else if(loginExists){

        console.log("User " + login + " already exist!");
        return res.status(409).send("Login already exists");

    }else{
        db.collection('Users').insertOne(newUser, function(err, res){
            if (err) throw err;
        });
        console.log("User " + login + " added!");
        const results = await db.collection('Users').find({Login: req.body.login}).toArray();
        const insertedData = await db.collection('Users').find({}).toArray();
        var ret = { id: insertedData[0]._id, firstName: firstname, lastName: lastname, error: '' };
        res.status(200).json(ret);
    }


});




app.listen(5001); // start Node + Express server on port 5001