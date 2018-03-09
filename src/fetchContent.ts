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
  fs.writeFileSync('./content.json', content)
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
