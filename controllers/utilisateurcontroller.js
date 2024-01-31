const mariadb=require('../databses/mariadb')


exports.getetudiants= async(req,res)=>{
    const conn = await mariadb.getConnection();
	const rows = await conn.query("SELECT * from utilisateur");

    conn.release()
    res.status(200).json(rows)
}

exports.getetudiants2= async(req,res)=>{

const conn = await mariadb.getConnection();
const rows = await conn.query("SELECT * from utilisateur WHERE id = ?",[parseInt(req.prams.id)]);

conn.release()
res.status(200).json(rows)}
