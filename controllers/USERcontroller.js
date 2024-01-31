const mariadb=require('../databses/mariadb')

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const pool = require('../databses/mariadb');
require('dotenv').config()

//Midleware
exports.authenticator=async(req,res,next)=>{
    const token=req.body.token ? req.body.token : req.headers.authorization
    if(token){
       let decoded= jwt.verify(token, process.env.SECRET_KEY)
        console.log(decoded)
       if(decoded){
            next()
       }else{
        return res.status(401).json("unauthorize")
       }

    }else{
        return res.status(401).json("unauthorize")
       }

}



exports.Admin_OR_NOT=async(req,res,next)=>{
    const token=req.body.token ? req.body.token : req.headers.authorization
     jwt.verify(token, process.env.SECRET_KEY, async(err, decoded)=>{
        if(err){    
            return res.status(401).json("unauthorize") 
        }
        else{
            const conn = await mariadb.getConnection();
            const rows = await conn.query("SELECT role from utilisateur where email = ?",[decoded.email]);
            conn.release()
            console.log(rows[0].role);
            if(rows[0].role === "admin"){
                next()
            }
            else{
                return res.status(401).json("unauthorize") 
            }
        }
     })



    }



//functions
exports.ShowAll= async(req,res)=>{
    const conn = await mariadb.getConnection();
	const rows = await conn.query("SELECT * from user");

    conn.release()
    res.status(200).json(rows)
}

exports.inscription= async(req,res)=>{
    const {email,password}=req.body
    const conn=await pool.getConnection()
    const result= await conn.query("select * from user where email = ?",[email] )
    conn.release()
    console.log(result.length)
    if(result.length>0){
        return res.status(400).json("erreur :email déjà utilisé")
    }
//hash mtp plus inscription
    const haspassword=await bcrypt.hash(password,10)
    await conn.query('insert into user (email,password) values(?,?)',[email,haspassword])
    conn.release()


    //génération et envoie token

const token= jwt.sign({email},process.env.SECRET_KEY,{expiresIn:'1h'})
const review=jwt.verify(token, process.env.SECRET_KEY)
console.log(review)

    res.json(token)
}



exports.login= async(req,res)=>{
    
  
    const {email,password}=req.body
    const conn=await pool.getConnection()
    const result= await conn.query("select * from user where email = ?",[email] )
   if(result.length===0){
    return res.status(400).json("erreur :email non trouver")

   }

   //bcrypt.compare

   const passwordTrue=await bcrypt.compare(password,result[0].password)

   console.log(passwordTrue);

   if(!passwordTrue){
    return res.status(400).json("erreur :mot de passe incorrect")

   }

   const token= jwt.sign({email},process.env.SECRET_KEY,{expiresIn:'1h'})
   res.json(token)


}


