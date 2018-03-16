const replaceAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const normalizeTitle = (title: string) =>
  replaceAccents(title)
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')

const generatePath = (number: number, title: string) =>
  `${number}-${normalizeTitle(title)}`

const formatSongContent = (songContent: string) => {
  const refren = /Refren\n([^]*?)\n\n/
  const autor = /(Versuri:(.*)\n)/
  const melodie = /(Melodie:(.*)\n)/
  const formatted = songContent
    .replace('Refren\n\n', 'Refren\n')
    .replace(refren, '<em>$1</em>\n\n')
    .replace(autor, '<small>$1</small>')
    .replace(melodie, '<small>$1</small>')
    .replace(/\(bis\)/g, '<small>(bis)</small>')
    .replace(/\/\//g, '/')
    .replace(/\/(?!small>)(?!em>)/g, '<small>/</small>')
    .replace(/(\n)+$/, '')
  return formatted
}

const formatSongs = (songs: Pieces): Pieces =>
  songs.filter(x => x).map(({ number, title, content }) => ({
    number,
    title,
    content: formatSongContent(content),
    path: generatePath(number, title),
  }))

const formatPoemsFolder = (books: Pieces): Pieces =>
  books.map(({ number, title, description, content }) => ({
    number,
    title,
    description,
    content,
    path: generatePath(number, title),
  }))

const formatPoemsFolders = (poems: PoemsRaw): Folders =>
  Object.entries(poems).map(poem => ({
    title: poem[0],
    files: formatPoemsFolder(poem[1].books),
  }))

const formatContent = ({
  saCantamDomnului,
  alteCantari,
  colinde,
  poezii,
}: ContentRaw): ContentFormatted => ({
  songs: {
    title: 'Cântări',
    folders: [
      {
        title: 'Să cântăm Domnului',
        files: formatSongs(saCantamDomnului),
      },
      {
        title: 'Alte Cântări',
        files: formatSongs(alteCantari),
      },
      {
        title: 'Colinde',
        files: formatSongs(colinde),
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
}
type Pieces = Piece[]
type PoemsRaw = { [title: string]: { books: Pieces } }
type ContentRaw = {
  saCantamDomnului: Pieces
  alteCantari: Pieces
  colinde: Pieces
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
