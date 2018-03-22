if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const fs = require('fs')
const firebase = require('firebase')

const config = {
  apiKey: process.env.API_KEY,
  databaseURL: process.env.DATABASE_URL,
}
firebase.initializeApp(config)

type Snapshot = {
  val: () => object
}
const writeContent = (snapshot: Snapshot) => {
  const raw = snapshot.val()
  const content = JSON.stringify(raw)
  const contentNormalized = content
    .replace(/"comtent"/g, '"content"')
    .replace(/"numar"/g, '"number"')
    .replace(/\\n\\n \\n/g, '\\n\\n')
    .replace(/\\n \\n/g, '\\n\\n')
    .replace(/ã/g, 'ă')
    .replace(/Ã/g, 'Ă]')
    .replace(/ş/g, 'ș')
    .replace(/Ş/g, 'Ș')
    .replace(/ţ/g, 'ț')
    .replace(/Ţ/g, 'Ț')
  fs.writeFileSync('./content.json', contentNormalized)
  process.exit()
}

const getContent = () => {
  firebase
    .database()
    .ref()
    .child('cantari')
    .once('value')
    .then((snapshot: Snapshot) => {
      writeContent(snapshot)
    })
    .catch((err: any) => {
      console.log(err)
      process.exit(1)
    })
}

getContent()
