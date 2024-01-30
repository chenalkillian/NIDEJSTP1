

const express = require('express')
const app = express()
const mariadb=require('./mariadb.js')
 app.use(express.json())
 var cors = require('cors')
const { format } = require('path')
 app.use(cors())
    //Route API
    app.get('/poke',async(req,res)=>{
        
	const conn = await mariadb.getConnection();
	const rows = await conn.query("SELECT * from utilisateur");

    conn.release()
    res.status(200).json(rows)
})
        
app.post('/user',async(req,res)=>{
        
	const conn = await mariadb.getConnection();
    const rows2 = await conn.query("SELECT * from utilisateur");
    let nom=req.body.nom
    let prenom=req.body.prenom
    let email=req.body.email


    const rows = await conn.query("INSERT INTO utilisateur (nom,prenom,email) value (?, ?,?)", [nom, prenom,email]);
    conn.release()
    res.status(200).json(rows2)
})


app.get('/poke/modify',async(req,res)=>{
    let choix=req.body.choix
    let nom=req.body.nom
    let prenom=req.body.prenom
    let email=req.body.email
    const conn = await mariadb.getConnection();
    const query = 'UPDATE utilisateur SET nom = ?, prenom = ?, email = ? WHERE nom = ?';
  const row2=   await conn.query(query, [nom, prenom, email, choix]);
    const rows3 = await conn.query("SELECT * from utilisateur");

	console.log(row2)

    conn.release()
    res.status(200).json(rows3)
})

app.get('/poke/delete',async(req,res)=>{
    let choix=req.body.choix

    const conn = await mariadb.getConnection();
    const query = 'DELETE FROM utilisateur WHERE nom = ?';
    const rows = await conn.query(query, [choix]);
    const rows3 = await conn.query("SELECT * from utilisateur");



    conn.release()
    res.status(200).json(rows3)
})


app.get('/commentaire/add',async(req,res)=>{
    let choix = req.body.choix;

    const conn = await mariadb.getConnection();
    
    const insertQuery = "INSERT INTO commentaire (datecreation) VALUES (?)";
    const rows = await conn.query(insertQuery, [choix]);
    
    const selectQuery = "SELECT * FROM commentaire";
    const rows3 = await conn.query(selectQuery);
    
    conn.release();
    
    res.status(200).json(rows3);
    
})

app.get('/commentaireetTechno',async(req,res)=>{


    const conn = await mariadb.getConnection();
    const rows = await conn.query(" SELECT nom,prenom,email,datecreation,nomtechno FROM commentaire,technologie,utilisateur WHERE utilisateur.id=commentaire.id");
   
    
    conn.release()
    res.status(200).json(rows)
})

//afficher chaque date liée à un user
app.get('/commentaireANDuser',async(req,res)=>{


    const conn = await mariadb.getConnection();
    const rows = await conn.query("SELECT DISTINCT iduser,nom,prenom,datecreation FROM commentaire,utilisateur WHERE commentaire.iduser=utilisateur.id");
   
    
    conn.release()
    res.status(200).json(rows)
})

app.get("/commentaireDATEinNferieure", async (req, res) => {
 
    const  date  = req.body.date;
    const conn = await mariadb.getConnection();

    const rows = await conn.query("SELECT * FROM Commentaire WHERE datecreation < ?",[date]);
    
    conn.release()
res.json(rows);
  });


  
  async function GetUsers() {

    const response = await fetch('http://localhost:8000/poke');
    const data = await response.json();
    document.getElementById('function').innerHTML = JSON.stringify(data, null, 2);

}


async function ADDuser(){
    let nom=document.getElementById('nom').value
    let prenom=document.getElementById('prenom').value
    let email=document.getElementById('email').value

    let response = await fetch('http://localhost:8000/user', {
    method: 'POST',
     headers: {
      'Content-Type': 'application/json;charset=utf-8'
                 },

body: JSON.stringify({nom:nom,
prenom:prenom,
email:email})
});}


app.listen(8000,()=>{
    console.log('Le serveur est en ligne')
})


