const express = require('express');
const { alluser,register,addcompany} = require('../controller/user.controller');
const {verifyAccessToken} = require("../middlewere/jwt")

const route = express.Router()



route.get('/alluser',verifyAccessToken, alluser)
route.post('/create',register) 
route.post('/add-company/:id',verifyAccessToken,addcompany)





module.exports = route



