require('dotenv').config()
const fs = require('fs')
const firebase = require('firebase')

const config = {
  apiKey: process.env.API_KEY,
  databaseURL: process.env.DATABASE_URL,
}
firebase.initializeApp(config)

const writeContent = snapshot => {
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
    .then(snapshot => {
      writeContent(snapshot)
    })
    .catch(err => {
      console.log(err)
      process.exit(1)
    })
}

getContent()
