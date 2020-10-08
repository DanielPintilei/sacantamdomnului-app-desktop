import { DATABASE_URL } from '../env'

const normalizeContent = (snapshot: JSON) => {
  const content = JSON.stringify(snapshot)
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
  fetch(`${DATABASE_URL}/${child}`)
    .then((res) => res.json())
    .then((resJSON) => {
      if (Object.entries(resJSON).length) {
        const { version, arrayBook } = resJSON
        return {
          version,
          content: normalizeContent(arrayBook),
        }
      } else throw new Error()
    })

export default fetchContent
