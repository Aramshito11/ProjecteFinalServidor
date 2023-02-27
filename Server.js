//NodeJS: localhost:4080

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());


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



app.get('/exemplee', cors(), async (req, res)=>{
    const cityRef = db.collection('usuaris').doc('5elh69EI0AiKX1Jy5KIq');
    const doc = await cityRef.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', doc.data());
    }
    res.json(doc.data());
});

app.post('/exemplee', cors(),async (req)=>{
    const noms={PROVA: req.body.user};
    const res = await db.collection('usuaris').doc('5elh69EI0AiKX1Jy5KIq').set(noms);
    console.log(noms)
});



// app.post('/api/correo', async (req, res) =>{
//     // console.log("Cuerpo: "+JSON.stringify(req.body.params))
//     let email =req.body;
//     console.log("Correo: "+req.body.email)
//     comprovar(email);
// });
//
// async function comprovar(email){
//     const docs = db.collection('usuaris')
//     const snapshot = await docs.where('email', '==', email).get()
//     snapshot.forEach(doc =>{
//         console.log(doc.id, '=>', doc.data())
//         return true;
//     })
//     console.log("Correo def: "+JSON.stringify(email))
// }

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
