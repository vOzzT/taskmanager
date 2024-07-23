const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const ObjectId = require('mongodb').ObjectId;

const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
  

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

app.get('/api/verify/:token', (req, res)=>{
    const {token} = req.params;
    const db = client.db('COP4331');
  
    // Verifying the JWT token 
    jwt.verify(token, 'ourSecretKey', function(err, decoded) {
        if (err) {
            console.log(err);
            res.status(400).send("Email verification failed, possibly the link is invalid or expired");}
        else {
            res.status(200).send("Email verified successfully\n CLOSE!");
            let decId = new ObjectId(decoded._id);
            let ret = db.collection('Users').updateOne({_id: decId},{$set: { isVerified: true}});
            ret.then(function(ret) {
                console.log(ret);
             }).catch((err) => {console.log('Error: ' + err);})
        }
    });
    
});

app.post('/api/forgot-password', async (req, res) => {
    const db = client.db('COP4331');
    
    const { email } = req.body;
  
    const user = await db.collection('Users').findOne({ Email: email });

    if (!user) {
      return res.status(400).send('User with this email does not exist.');
    }

    const isUserVerified = user.isVerified;
    if(!isUserVerified){
        return res.status(400).json({ message: 'User not Verified' });
    }
  
    const token = jwt.sign({ id: user._id }, 'ourSecretKey', { expiresIn: '1h' });
    //decId = new ObjectId(decoded.id);
    let ret = db.collection('Users').updateOne({Email: email},{$set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000}});
            ret.then(function(ret) {
                console.log(ret);
             }).catch((err) => {console.log('Error: ' + err);})
  
    //user.resetPasswordToken = token;
    //user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
    //await user.save();
  
    const resetEmail = {

    from: 'poosdtaskmanagerapi@gmail.com',
        
    to: email,
      
    subject: 'Password Reset',
    
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
             https://taskmanager-poosd-b45429dde588.herokuapp.com/reset/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(resetEmail, function(error, info){
        if (error) throw Error(error);
        res.status(200).send('Email Sent Successfully');
        //console.log(info);
    });

    res.status(200).json({token});
});

app.post('/api/reset-password/:token', async (req, res) => {
    const db = client.db('COP4331');
    const {token} = req.params;
    const  { password } = req.body;

    try {
      const decoded = jwt.verify(token, 'ourSecretKey');

      const user = await db.collection('Users').findOne({ resetPasswordToken: token });
  
      if (!user) {
        return res.status(400).send('Password reset token is invalid or has expired.');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
        decId = new ObjectId(decoded.id);
      let ret = db.collection('Users').updateOne({_id: decId},{$set: { Password: hashedPassword, resetPasswordToken: undefined, resetPasswordExpires: undefined}});
            ret.then(function(ret) {
                console.log(ret);
             }).catch((err) => {console.log('Error: ' + err);})
      
  
      //user.password = hashedPassword;
      //user.resetPasswordToken = undefined;
      //user.resetPasswordExpires = undefined;
  
      //await user.save();
  
      res.status(200).send('Password has been reset.');
    } catch (err) {
      res.status(400).send('Password reset token is invalid or has expired.');
    }
});

app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    var error = '';

    const { login, password } = req.body;

    const db = client.db('COP4331');

    try {

        // Find the user by Username
        const user = await db.collection('Users').findOne({ Login: login});
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // Compare the Password
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // Is the user verified
        const isUserVerified = user.isVerified;
        if(!isUserVerified){
            return res.status(400).json({ message: 'User not Verified' });
        }

        const data = {
            "id": user._id, 
            "firstname": user.FirstName, 
            "lastname": user.LastName
        }

        const token = jwt.sign(data, 'privatekey', { expiresIn: '1h' });
        var ret = { token };
        res.status(200).json(ret);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
});

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}

app.get('/api/data', checkToken, (req, res) => {
        //verify the JWT token generated for the user
        jwt.verify(req.token, 'privatekey', async (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                //If token is successfully verified, we can send the autorized data 
                const db = client.db('COP4331');
                let query = {};
                let eventArr = [];
                userId = authorizedData.id;
                firstname = authorizedData.firstname;
                lastname = authorizedData.lastname;
                if (userId) query.UserId = userId;
                const events = await db.collection('Events').find(query).toArray();
                //authorizedData
                res.status(200).json({
                    message: 'Successful log in',
                    id: userId,
                    firstname: firstname,
                    lastname: lastname,
                    events: events,
                    error: ''
                });
                console.log('SUCCESS: Connected to protected route');
            }
        })
    });


app.post('/api/signup', async (req, res, next) => {
    // incoming: firstname, lastname, login, password, email, phone
    // outgoing: id, firstName, lastName, error

    var error = '';
    
    const { login, password, firstname, lastname, phone, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = { Login: login, Password: hashedPassword, FirstName: firstname, LastName: lastname, Phone: phone, Email: email , isVerified: false, resetPasswordToken: undefined, resetPasswordExpires: undefined}; 

    const db = client.db('COP4331');
 
    //Checks to see if login or email is taken
    const loginExists = await db.collection('Users').findOne({Login: req.body.login});
    const emailExists = await db.collection('Users').findOne({Email: req.body.email});

    if ((loginExists && emailExists)){

        console.log("User " + login + " and email " + email + " already exist!");
        return res.status(409).send("Login and email already exist");

    } else if (emailExists){

        console.log("Email " + email + " already exists!");
        return res.status(409).send("Email already exists");

    } else if (loginExists){

        console.log("User " + login + " already exist!");
        return res.status(409).send("Login already exists");

    } else {
        db.collection('Users').insertOne(newUser, function(err, res){
            if (err) throw err;
        });
        console.log("User " + login + " added!");
        const results = await db.collection('Users').find({Login: req.body.login}).toArray();
        const insertedData = await db.collection('Users').find({Login: req.body.login}).toArray();
        const user = await db.collection('Users').findOne({ Login: login});
        //console.log(user._id);
        //var ret = { id: user._id, firstName: firstname, lastName: lastname, error: '' };
        console.log(user._id);
        
        let mail = {
            "_id": user._id,
            "data": "token data"
        }
        
        const token = jwt.sign(mail, 'ourSecretKey', { expiresIn: '30m' }); 

        const verificationEmail = {
    
            // It should be a string of sender/server email
            from: 'poosdtaskmanagerapi@gmail.com',
        
            to: email,
        
            // Subject of Email
            subject: 'Email Verification For Taskmanager App',
            
            // This would be the text of email body
            text: `Press this link to verify your email: https://taskmanager-poosd-b45429dde588.herokuapp.com/api/verify/${token} Thanks`
        };
        
        transporter.sendMail(verificationEmail, function(error, info){
            if (error) throw Error(error);
            console.log('Email Sent Successfully');
            console.log(info);
        });

        res.status(200).json({token});
    }

});

app.post('/api/addEvent', async (req, res, next) => {
    // incoming: name, description, color, tags, userId, endDate, startDate
    // outgoing: id, name, UserId, error
    var error = '';

    const { name, description, color, tags, userId, endDate, startDate } = req.body;

    let newEvent = { Name: name, Description: description, Color: color, Tags: tags, UserId: userId, EndDate: endDate, StartDate: startDate };

    const db = client.db('COP4331');

    //const results = await db.collection('Events');

    db.collection('Events').insertOne(newEvent, function(err, res){
        if (err) throw err;
        res.status(500);
    });
    console.log("Event " + name + " added!");
    const results = await db.collection('Events').find({Name: req.body.name}).toArray();
    const insertedData = await db.collection('Events').find({Name: req.body.name}).toArray();
    var ret = { id: insertedData[0]._id, name: name, description: description, error: '' };
    res.status(200).json(ret);

});

app.post('/api/searchEvent', async (req, res, next) => {
    // incoming: name, description, color, tags, userId, endDate, startDate
    // outgoing: events, error
    const { name, description, color, tags, userId, endDate, startDate } = req.body;
    const db = client.db('COP4331');
    
    // Build the search query object
    let query = {};

    if (name) query.Name = { $regex: name, $options: 'i' };
    if (description) query.Description = { $regex: description, $options: 'i' };
    if (color) query.Color = { $regex: color, $options: 'i' };
    if (tags) query.Tags = { $regex: tags, $options: 'i' };
    if (userId) query.UserId = userId;
    if (endDate) query.EndDate = { $regex: endDate, $options: 'i' };
    if (startDate) query.StartDate = { $regex: startDate, $options: 'i' };

    try {
        const events = await db.collection('Events').find(query).toArray();
        res.status(200).json({ events: events, error: '' });
    } catch (err) {
        res.status(500).json({ events: [], error: err.toString() });
    }

});

app.post('/api/updateEvent', async (req, res, next) => {
    // incoming: id, name, description, color, tags, userId, endDate, startDate
    // outgoing: updatedEvent, error
    const { id, name, description, color, tags, userId, endDate, startDate } = req.body;
    const db = client.db('COP4331');

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
    }

    let updatedFields = {};

    if (name) updatedFields.Name = name;
    if (description) updatedFields.Description = description;
    if (color) updatedFields.Color = color;
    if (tags) updatedFields.Tags = tags;
    if (userId) updatedFields.UserId = userId;
    if (endDate) updatedFields.EndDate = endDate;
    if (startDate) updatedFields.StartDate = startDate;

    try {
        const result = await db.collection('Events').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const updatedEvent = await db.collection('Events').findOne({ _id: new ObjectId(id) });
        res.status(200).json({ updatedEvent, error: '' });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }

});

app.post('/api/deleteEvent', async (req, res, next) => {
    // incoming: id
    // outgoing: success, error
    const { id } = req.body;
    const db = client.db('COP4331');

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
    }

    try {
        const result = await db.collection('Events').deleteOne({ _id: new ObjectId(id) });

        console.log('Delete result:', result);

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ success: true, error: '' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: err.toString() });
    }

});


app.post('/api/addTag', async (req, res, next) => {
    // incoming: name, color, userId
    // outgoing: id, name, UserId
    var error = '';

    const { name, color, userId } = req.body;

    let newTag = { Name: name, Color: color, UserId: userId };

    const db = client.db('COP4331');

    //const results = await db.collection('Events');

    db.collection('Tags').insertOne(newTag, function(err, res){
        if (err) throw err;
    });
    console.log("Tag " + name + " added!");
    const results = await db.collection('Tags').find({Name: req.body.name}).toArray();
    const insertedData = await db.collection('Tags').find({Name: req.body.name}).toArray();
    var ret = { id: insertedData[0]._id, name: name, userId: userId, error: '' };
    res.status(200).json(ret);

});

if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) =>
        {
            res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
        });
}

app.listen(PORT, () =>{console.log('Server listening on port ' + PORT);});
