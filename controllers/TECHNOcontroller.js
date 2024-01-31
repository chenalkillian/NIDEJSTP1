const mariadb=require('../databses/mariadb')

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const pool = require('../databses/mariadb');
require('dotenv').config()

//Midleware
exports.SHOWALL=async(req,res)=>{
    const conn = await mariadb.getConnection();
	const rows = await conn.query("SELECT * from technologie");

    conn.release()
    res.status(200).json(rows)
}


//Midleware
exports.Inser=async(req,res)=>{
        
	const conn = await mariadb.getConnection();
    const rows2 = await conn.query("SELECT * from technologie");
    let nomtech=req.body.nomtechno
    let date=req.body.date
    let nom=req.body.nom


    const rows = await conn.query("INSERT INTO technologie (nomtechno,date,nom) value (?, ?,?)", [nomtech, date,nom]);
    conn.release()
    res.status(200).json(rows2)
}




//Midleware
exports.Update=async(req,res)=>{
        
    let choix=req.body.choix
    let nomtech=req.body.nomtechno
    let date=req.body.date
    let nom=req.body.nom
    const conn = await mariadb.getConnection();
    const query = 'UPDATE technologie SET nomtechno = ?, date = ?, nom = ? WHERE nom = ?';
  const row2=   await conn.query(query, [nomtech, date, nom, choix]);
    const rows3 = await conn.query("SELECT * from technologie");

	console.log(row2)

    conn.release()
    res.status(200).json(rows3)
}

//Midleware
exports.Delete=async(req,res)=>{
        
    let choix=req.body.choix

    const conn = await mariadb.getConnection();
    const query = 'DELETE FROM technologie WHERE nom = ?';
    const rows = await conn.query(query, [choix]);
    const rows3 = await conn.query("SELECT * from technologie");



    conn.release()
    res.status(200).json(rows3)
}


exports.inscription= async(req,res)=>{
    const {nom,prenom,email,password,role}=req.body
    const conn=await pool.getConnection()
    const result= await conn.query("select * from utilisateur where nom = ?",[nom] )
    conn.release()
    console.log(result.length)
    if(result.length>0){
        return res.status(400).json("erreur :email déjà utilisé")
    }
//hash mtp plus inscription
    const haspassword=await bcrypt.hash(password,10)
    await conn.query('insert into utilisateur (nom,prenom,email,password,role) values(?,?,?,?,?)',[nom,prenom,email,haspassword,role])
    conn.release()
    
    return res.status(400).json("inscription effectuer")

}


//login
exports.login= async(req,res)=>{
    console.log(req.body)
  
    const {email,password}=req.body
    const conn=await pool.getConnection()
    const result= await conn.query("select * from utilisateur where email = ?",[email] )
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



exports.Journaliste_OR_NOT=async(req,res,next)=>{
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
            if(rows[0].role === "journaliste"){
                next()
            }
            else{
                return res.status(401).json("unauthorize") 
            }
        }
     })



    }



    exports.AddcommentS= async(req,res)=>{
        const {datecreation,Message}=req.body
        const conn=await pool.getConnection()
        conn.release()
       
        await conn.query('insert into commentaire (datecreation,Message) values(?,?)',[datecreation,Message])
        conn.release()
        const result= await conn.query("select * from commentaire")

        return res.status(400).json(result)
    
    }






    //les utilisateurs classique peuvent voir les commentaires

exports.commentaire=async(req,res)=>{
    const conn = await mariadb.getConnection();
	const rows = await conn.query("SELECT * from commentaire");

    conn.release()
    res.status(200).json(rows)
}

//montrer toute la table commentaire si token présent

exports.ShowallOFcomment=async(req,res)=>{
    const conn = await mariadb.getConnection();
	const rows = await conn.query("SELECT * from commentaire");

    conn.release()
    res.status(200).json(rows)
}

//Pour savoir si on n'affiche que les commentaire ou pas

exports.Login_OR_NOT=async(req,res,next)=>{
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

//les personnes non connecté ne peuvent pas voir les commentaire
exports.Showall=async(req,res)=>{
    const conn = await mariadb.getConnection();
	const rows = await conn.query("SELECT Message from commentaire");

    conn.release()
    res.status(200).json(rows)
}
