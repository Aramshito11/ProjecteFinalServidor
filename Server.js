//NodeJS: localhost:4080

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json(), cors());

port = 4080;
app.listen(port, () => {
    console.log(`Port::${port}`);
});

var admin = require("firebase-admin");

var serviceAccount = require(".\\usuaris-e30d6-firebase-adminsdk-6aa2i-283c975af3.json");

const {getFirestore} = require("firebase-admin/firestore");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

app.post('/registre', cors(), (req, res)=>{

    const user={'Usuari': req.body.user,
        'email': req.body.email,
        'contrasenya': req.body.password};
    db.collection('usuaris').add(user);
    console.log(user);
})

app.get('/api/check', async (req,res)=>{
    let correu = {email: req.query.email}
    let resultat = false;
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', correu.email).get()
    snapshot.forEach(doc =>{
        console.log(doc.id, '=>', doc.data())
        resultat = true
    })
    res.json(resultat)
});

app.get('/inicisessio', async (req,res)=>{
    let correu = {email: req.query.email}
    let resultat = false;
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', correu.email).get()
    snapshot.forEach(doc =>{
        console.log(doc.id, '=>', doc.data())
        resultat = true
    })
    res.json(resultat)
});

app.get('/contrasenya', async (req,res)=>{
    let correu = {name: req.query.name}
    let resultat = false;
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('contrasenya', '==', correu.name).get()
    snapshot.forEach(doc =>{
        console.log(doc.id, '=>', doc.data())
        resultat = true
    })
    res.json(resultat)
});

const axios = require('axios');

async function sendEmail(name, email) {
    const data = JSON.stringify({
        "Messages": [{
            "From": {"Email": "aram.mateos@institutvidreres.cat", "Name": "Aram"},
            "To": [{"Email": email, "Name": name}],
            "Subject": "Cambiar tu contraseña",
            "TextPart": "Hola buenas, \n"+
                "Hemos recibido una solicitud de cambio de contraseña, en caso de ser tu quien ha solicitado esto, entra en el link que tienes a continuación. En caso contrario alguien esta intentando acceder a tu cuenta. \n" +
                "" +
                "http://localhost:4200/canvi \n" +
                "" +
                "Attentamente:  \n" +
                "" +
                "Amazon."
        }]
    });

    const config = {
        method: 'post',
        url: 'https://api.mailjet.com/v3.1/send',
        data: data,
        headers: {'Content-Type': 'application/json'},
        auth: {username: 'facf0ff81050642cbb782be394c4cd12', password: '354e4d6f8c62a81229b065c733d4ab1c'},
    };

    return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });

}

app.post('/api/sendemail/', function (req, res) {
    console.log("Correu Enviat")
    const {name, email} = req.body;
    sendEmail(name, email);
});

app.post('/api/contrasenya', async (req,res)=>{
    const {email, contra}=req.body
    var documento=""
    const docs = db.collection('usuaris')
    const snapshot = await docs.where('email', '==', email).get();
    snapshot.forEach(doc =>{
        console.log("Doc ID: "+doc.id)
        documento=doc.id;
    })

    const moddify = await db.collection('usuaris').doc(documento).set({contrasenya: contra}, {merge:true})
    res.json(contra)
})
