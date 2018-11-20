import * as firebase from 'firebase'
import { API_KEY, DATABASE_URL } from '../env'

const config = {
  apiKey: API_KEY,
  databaseURL: DATABASE_URL,
}
firebase.initializeApp(config)

type DataSnapshot = firebase.database.DataSnapshot

const normalizeContent = (snapshot: DataSnapshot) => {
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
  return JSON.parse(contentNormalized)
}

const fetchContent = (child: string = '') =>
  firebase
    .database()
    .ref()
    .child(`cantari${child}`)
    .once('value')
    .then((snapshot: DataSnapshot) => normalizeContent(snapshot))
    .catch((err: any) => {
      console.log(err)
    })

export const fetchVersions = () =>
  firebase
    .database()
    .ref()
    .child('Users')
    .child('uploadBook')
    .once('value')
    .then((snapshot: DataSnapshot) => snapshot.val())

export default fetchContent
