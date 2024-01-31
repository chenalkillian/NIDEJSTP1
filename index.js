
  
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







async function Login(){
    let email=document.getElementById('email').value
    let password=document.getElementById('password').value
    await fetch('http://localhost:8000/techno/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email:email,
            password:password
        })
    }).then((response)=>response.json())
    .then((data)=>{
        sessionStorage.setItem('TOKEN',data)
        console.log(data.role)
    })
    document.getElementById('function').innerHTML = JSON.stringify(sessionStorage.getItem('TOKEN'), null, 2);
    sessionStorage.removeItem('TOKEN')
}





async function Afficher(){

    let token=document.getElementById('email').value
    await fetch('http://localhost:8000/techno/Showall', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            token:token})
    }).then((response)=>response.json())
    .then((data)=>{
        sessionStorage.setItem('TOKEN',data)
        console.log(data.role)
    })
    document.getElementById('function').innerHTML = JSON.stringify(sessionStorage.getItem('TOKEN'), null, 2);
    sessionStorage.removeItem('TOKEN')
  

}
