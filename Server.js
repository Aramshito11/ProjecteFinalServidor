//NodeJS: localhost:3080

const express = require('express');
const app = express();
const cors = require('cors');


app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3080/exemple',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));



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

