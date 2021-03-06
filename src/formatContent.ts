export const replaceAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const normalizeTitle = (title: string) =>
  replaceAccents(title)
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')

const generatePath = (number: number, title: string) =>
  `${number}-${normalizeTitle(title)}`

const refren = /Refren\n([^]*?)\n\n/
const refrenGlobal = /Refren\n([^]*?)\n\n/g
const autor = /(Versuri:(.*)\n)/
const melodie = /(Melodie:(.*)\n)/

const formatSongContent = (songContent: string) => {
  const multipleRefrains = (songContent.match(refrenGlobal) || []).length > 1
  const formatted = songContent
    .replace(/Refren\n\n/g, 'Refren\n')
    .replace(
      refrenGlobal,
      multipleRefrains ? '<em>$1</em>\n\n' : '<em class="sticky">$1</em>\n\n',
    )
    .replace(autor, '<small>$1</small>')
    .replace(melodie, '<small>$1</small>')
    .replace(/\(bis\)/g, '<small>(bis)</small>')
    .replace(/\/\//g, '/')
    .replace(/\/(?!small>)(?!em>)/g, '<small>/</small>')
    .replace(/(\n)+$/, '')
  return formatted
}

const formatStanzas = (
  title: string,
  content: string,
  number?: number | string,
): string[] => {
  const contentWithRefrenNormalized = content.replace(/Refren\n\n/g, 'Refren\n')
  const contentMatchRefren = contentWithRefrenNormalized.match(refrenGlobal)
  const contentMatchRefrenIsMultipe =
    contentMatchRefren && contentMatchRefren.length > 1
  const contentTrimmed = contentWithRefrenNormalized
    .replace(refrenGlobal, contentMatchRefrenIsMultipe ? '<em>$1</em>\n\n' : '')
    .replace(autor, '')
    .replace(melodie, '')
    .trim()
  const contentSplit = contentTrimmed.split('\n\n')
  const formatStanza = (stanza: string): string =>
    stanza
      .replace(/\(bis\)/g, '<small>(bis)</small>')
      .replace(/\/\//g, '/')
      .replace(/\/(?!small>)(?!em>)/g, '<small>/</small>')
      .replace(/(\n)+$/, '')
  const stanzas = contentSplit.map((stanza) => {
    return formatStanza(stanza)
  })
  stanzas[0] = `<h1>${number ? number + '. ' : ''}${title}</h1>${stanzas[0]}`
  const addEnding = (stanzaArray: string[]): string[] => [
    ...stanzaArray.map((stanza, index) => {
      if (stanzaArray.length - 1 === index) return stanza + '\n\n<p>Amin</p>'
      return stanza
    }),
    '',
  ]
  if (!contentMatchRefren || contentMatchRefrenIsMultipe) {
    return addEnding(stanzas)
  } else {
    const contentMatchRefrenSingle = contentWithRefrenNormalized.match(refren)!
    const formattedRefren = formatStanza(
      `<em>${contentMatchRefrenSingle[1]}</em>`,
    )
    const stanzasWithRefren = stanzas.reduce(
      (arr, next) => [...arr, next, formattedRefren],
      [],
    )
    return addEnding(stanzasWithRefren)
  }
}

const formatSongs = (songs: Pieces, displayNumber?: boolean): Pieces =>
  songs
    .filter((x) => x)
    .map(({ number, title, content }) => ({
      number,
      title,
      content: formatSongContent(content),
      path: generatePath(number, title),
      stanzas: formatStanzas(
        title,
        content,
        displayNumber ? number : undefined,
      ),
    }))

const formatPoemsFolder = (books: Pieces): Pieces =>
  books.map(({ number, title, description, content }) => ({
    number,
    title,
    description,
    content,
    path: generatePath(number, title),
    stanzas: formatStanzas(title, content),
  }))

const formatPoemsFolders = (poems: PoemsRaw): Folders =>
  Object.entries(poems.content).map((poem) => ({
    title: poem[1].name,
    files: formatPoemsFolder(poem[1].books),
  }))

const formatContent = ({
  scd,
  alteCantari,
  colinde,
  poezii,
}: ContentRaw): ContentFormatted => ({
  songs: {
    title: 'Cântări',
    folders: [
      {
        title: 'Să cântăm Domnului',
        files: formatSongs(scd.content, true),
      },
      {
        title: 'Alte Cântări',
        files: formatSongs(alteCantari.content),
      },
      {
        title: 'Colinde',
        files: formatSongs(colinde.content),
      },
    ],
  },
  poems: {
    title: 'Poezii Traian Dorz',
    folders: formatPoemsFolders(poezii),
  },
})

export const sortFoldersContent = (folders: Folders): Folders =>
  folders.map(({ title, files }) => ({
    title,
    files: files
      .slice()
      .sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase(), 'ro'),
      ),
  }))

export const arrayFoldersContent = (content: Folders): Pieces =>
  content.map(({ files }) => files).reduce((a, b) => [...a, ...b], [])

export type Piece = {
  number: number
  title: string
  description?: string
  content: string
  path: string
  stanzas: string[]
}
type Pieces = Piece[]
type ContentRawSingle = {
  version: number
  content: Pieces
}
type PoemsRaw = {
  version: number
  content: { [title: string]: { name: string; books: Pieces } }
}
export type ContentRaw = {
  scd: ContentRawSingle
  alteCantari: ContentRawSingle
  colinde: ContentRawSingle
  poezii: PoemsRaw
}
export type Folder = {
  title: string
  files: Pieces
}
type Folders = Folder[]
export type ContentFormatted = {
  songs: {
    title: string
    folders: Folders
  }
  poems: {
    title: string
    folders: Folders
  }
}

export default formatContent
