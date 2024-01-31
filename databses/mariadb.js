const mariadb=require('mariadb')

//mariadb
require('dotenv').config


const pool=mariadb.createPool({
    host:'localhost',
    database:'nodejs2',
    user:'killian',
    password:'killian2901',
    port:3306
})


module.exports=pool