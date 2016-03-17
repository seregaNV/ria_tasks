"use strict";
var ect = require("ect"),
    validator = require('validator'),
    users = require('../lib/users');

module.exports = {
    getUsers: function(req, res, next){
        setTimeout(function(next){
            try{
                var usersList = users.getAllUsers();
                res.statusCode = 200;
                res.write(JSON.stringify(usersList));
                next();
            }catch(e){
                next(e);
            }
        }, 500, next)
    },
    postUser: function(req, res, next){
        req.on('data', function(chunk) {
            var dataObj = JSON.parse(chunk.toString()),
                userData = {},
                valid = true;
            if (dataObj.hasOwnProperty('nick') && validator.isLowercase(dataObj.nick.toString()) && validator.isAlphanumeric(dataObj.nick.toString())) {
                userData.nick = dataObj.nick;
            } else {
                valid = false;
            }
            if (dataObj.hasOwnProperty('name') && validator.isAlpha(dataObj.name.toString())) {
                userData.name = dataObj.name;
            } else {
                valid = false;
            }
            if (dataObj.hasOwnProperty('e-mail') && validator.isEmail(dataObj['e-mail'].toString())) {
                userData['e-mail'] = dataObj['e-mail'];
            } else {
                valid = false;
            }
            if (dataObj.hasOwnProperty('description') && validator.isAlphanumeric(dataObj.description.toString())) {
                userData.description = dataObj.description;
            } else {
                valid = false;
            }
            if (dataObj.hasOwnProperty('age') && validator.isInt(dataObj.age.toString(), { min: 10, max: 99 })) {
                userData.age = dataObj.age;
            } else {
                valid = false;
            }
            if (valid) {
                users.setUser(userData);
                res.statusCode = 201;
                res.end();
            } else {
                res.statusCode = 400;
                res.end('Bad request');
            }
        });
    }
};