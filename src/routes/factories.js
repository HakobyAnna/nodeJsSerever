const config = require('../config');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
//const auth = require('../utils/auth');
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mail');
var rjwt = require('express-jwt');
const Factory = require('../models/Factory');


module.exports = server => {
    // get all Factory
    server.get('/api/factories', async (req, res) => {
        try {
            const factories = await Factory.find({});
            res.json(factories);
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    // get single factory data
    server.get('/api/factories/:id', async (req, res) => {
        try {
            const factory = await Factory.findById(req.params.id, (err) => {
                if(err){
                    res.sendStatus(404);
                }
            } );
            res.json(factory);
            
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    });

    // add factory
    server.post('/api/factories', async (req, res) => {
        if(req.is('application/json')){
            // do something
            const { name, director, employers, product } = req.body;

            const factory = new Factory({
                name: name,
                director: director,
                employers: employers,
                product: product
            });

            // save factories
            try {
                const newFactory = await factory.save();
                res.sendStatus(201);
            } catch(err) {
                console.log(err);
                res.sendStatus(400);
            }
        }
    });

    // update factory
    server.put('/api/factories/:id', async (req, res) => {
        if(req.is('application/json')){
            try {
                // find the factory and update it with given body
                const factory = await Factory.findOneAndUpdate({_id: req.params.id}, req.body );
                res.json(factory);
            } catch(err) {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(400);
        }
    });

    // delete factories
    server.delete('/api/factories/:id', async (req, res) => {
        try {
            // find and remove one factory
            const findFactory = await Factory.findById(req.params.id, async (err) => {
                if(err){
                    res.sendStatus(404);
                } else {
                 const factory = await Factory.findOneAndRemove({_id: req.params.id});
                 res.sendStatus(204);
                }
            });
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
}