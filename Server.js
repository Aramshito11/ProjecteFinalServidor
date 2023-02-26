//NodeJS: localhost:3080



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



app.get('/registre', cors(), async(req,res)=> {

    const citiesRef = db.collection('usuaris');
    const snapshot = await citiesRef.where('contrasenya:', '==', true).get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
    });index.js
    res.json(doc);
})
