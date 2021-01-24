const express = require('express');
const mongoose = require('mongoose');
const config = require('./src/config');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
var rateLimit = require('express-rate-limit');

// user docker?
var rjwt = require('express-jwt');

const server = express();

const mongodb_url =  'mongodb://user:pass@some.url';

const port = 5000;
const port_https = 443;

// api request limiter
var apiLimiter = new rateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 1000,
});
server.use('/api/', apiLimiter);

// create account limiter
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour"
});
server.use('/api/userignup', createAccountLimiter);

server.use(bodyParser.json());

// test path
server.get('/api/test', (req, res) => {

  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});

// server.get('/api/factories/:id', (req, res) => {

//   res.json(factories.params.id);
// });

let factories = [ {
  id: 1,
  name: 'EHP',
  director: 'Anna',
  employers: ['Elya', 'Robert'],
  product: ['phone', 'pc', 'laptop']
}, {
  id: 2,
  name: 'EPH',
  director: 'Elya',
  employers: ['Anna', 'Robert'],
  product: ['shirt', 'hat', 'skirt']
},
{
  id: 5,
  name: 'HhH',
  director: 'Elya',
  employers: ['Anna', 'Robert'],
  product: ['shirt', 'hat', 'skirt']
}
]

server.get('/api/factories/:id', (req, res) => {

  res.json(factories[req.params.id]);
});

server.get('/api/factories', (req, res) => {

  res.json(factories);
});

server.post('/api/factories', (req, res) => {

  const {name, director, employers, product} = req.body;
    const factory =  {
      id: 3,
      name,
      director, 
      employers,
      product
    }
    factories.push(factory)
    res.json('Factory number 3 added')
});

server.put('/api/factories/:id', (req, res) => {
  const {name, director, employers, product} = req.body;
  for(let i = 0; i < factories.length; i++) {
    if(factories[i].id == req.params.id) {
      console.log(factories[i]);
      factories[i].name = name;
      factories[i].director = director;
      factories[i].employers = employers;
      factories[i].product = product;
    }
  }
  res.json('Changed');
})

server.delete('/api/factories/:id', (req, res) => {
  let entryFound = false;

  for(let i = 0; i < factories.length; i++) {
    if(factories[i].id == req.params.id) {
      console.log(factories[i]);
      entryFound = true;
      factories.splice(i, 1);
    }
  } 

  if(entryFound) {
    res.json(`Entry deleted with the id ${req.params.id}`);
  } else {
    res.json('the element with given id does not exeist');
  }
})

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzM4ZjdjZDVlNDMyMzA2Y2NjNzY3MTMiLCJ1c2VySWQiOiJhZG1pbjIxIiwiZW1haWwiOiJhZG1pbjFAYWRtaW4uY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkS3ZqOHdWYVNGTlVkdmZCa01GdmtYTzQ0aHZqZWZRV2pQbjVRYjhFT0ZiOU96eEZFMW5IT1ciLCJ1cGRhdGVkQXQiOiIyMDE5LTAxLTExVDIwOjA4OjQ1Ljg3OVoiLCJjcmVhdGVkQXQiOiIyMDE5LTAxLTExVDIwOjA4OjQ1Ljg3OVoiLCJfX3YiOjAsImlhdCI6MTU0NzI0MjYyN30.-Odftt28G4TxFHXsk-5t8t474geHoAm6RjdPJv92oTo
//server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/api/auth', 'api/signupUser']} ));

//const httpsOptions = {
//  key: fs.readFileSync('ssl/server.key'),
//  cert: fs.readFileSync('ssl/server.crt')
//};  

//https.createServer(httpsOptions, server)
//  .listen(port_https, function ( ) {
//    console.log(`Server running on port ${port_https}` );
//});

server.listen(port, () => { 
  mongoose.set('useFindAndModify', false);
  //mongoose.connect(mongodb_url, {useNewUrlParser: true} );
  console.log(`Server running on port ${port}` );
});

const db  = mongoose.connection;

db.on('error', (err) => console.log(err));
db.once('open', () => {
  require('./src/routes/users')(server);
})