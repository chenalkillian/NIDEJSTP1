const express=require('express')

const Route=express.Router()

const TECHNO=require('../controllers/TECHNOcontroller')
const USER = require('../controllers/USERcontroller')
const utilisateur=require('../controllers/utilisateurcontroller')



Route.get('/getetudiants',utilisateur.getetudiants)

Route.get('/getetudiants/:id',utilisateur.getetudiants2)
        
Route.get('/All',USER.authenticator,USER.Admin_OR_NOT,USER.ShowAll)
Route.post('/inscription',USER.inscription)
Route.post('/login',USER.login)

//TP2

Route.get('/test',TECHNO.SHOWALL)
Route.post('/inser',TECHNO.authenticator, USER.Admin_OR_NOT,TECHNO.Inser)
Route.post('/modify',TECHNO.authenticator, USER.Admin_OR_NOT,TECHNO.Update)
Route.post('/delete',TECHNO.authenticator, USER.Admin_OR_NOT,TECHNO.Delete)
Route.post('/user/inscription',TECHNO.inscription)
Route.post('/user/login',TECHNO.login)

Route.post('/commentaire',TECHNO.Login_OR_NOT,TECHNO.Showall)
Route.post('/Showall',TECHNO.ShowallOFcomment)

Route.post('/addcommentaire',TECHNO.Journaliste_OR_NOT,TECHNO.AddcommentS)

module.exports=Route