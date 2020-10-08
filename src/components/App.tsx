import * as storage from 'electron-json-storage'
import * as React from 'react'
import { ipcRenderer } from 'electron'
import { HashRouter as Router } from 'react-router-dom'
import styled from 'styled-components'
import Index from './Index'
import Main from './Main'
import ControlPanel from './ControlPanel'
import fetchContent from '../fetchContent'
import formatContent, {
  arrayFoldersContent,
  ContentFormatted,
  Piece,
  ContentRaw,
} from '../formatContent'

storage.setDataPath()

const contentBooks = ['scd', 'alteCantari', 'colinde', 'poezii']

const Wrapper = styled.div`
  display: flex;
  background-color: #fff;
`

type ContentRawSingle = {
  version: number
  content: []
}

type AppState = {
  content?: ContentFormatted
  contentArray?: Piece[]
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    content: undefined,
    contentArray: undefined,
  }
  setContent = async (storageRawContent?: ContentRaw) => {
    const mergedContentRaw = { ...storageRawContent } as any
    const fetchAllContent = async () => {
      for (const book of contentBooks) {
        const child = `${book}/${
          storageRawContent && Object.entries(storageRawContent).length
            ? storageRawContent[book].version
            : 0
        }`
        await fetchContent(child)
          .then((contentRawSingle: ContentRawSingle) => {
            mergedContentRaw[book] = contentRawSingle
          })
          .catch((error) => error)
      }
    }
    await fetchAllContent()
    const content = formatContent(mergedContentRaw)
    const contentArray = arrayFoldersContent([
      ...content.songs.folders,
      ...content.poems.folders,
    ])
    storage.set('storageRawContent', mergedContentRaw, (error: any) => {
      if (error) throw error
    })
    storage.set('content', content, (error: any) => {
      if (error) throw error
    })
    storage.set('contentArray', contentArray, (error: any) => {
      if (error) throw error
    })
    this.setState({ content, contentArray })
  }
  getStoredContent = () => {
    storage.getMany(
      ['storageRawContent', 'content', 'contentArray'],
      (
        error,
        {
          storageRawContent,
          content,
          contentArray,
        }: { storageRawContent?: ContentRaw } & AppState,
      ) => {
        if (error) console.log(error)
        const isContent = Boolean(
          content &&
            Object.keys(content).length &&
            contentArray &&
            contentArray.length,
        )
        if (isContent) this.setState({ content, contentArray })
        this.setContent(storageRawContent)
      },
    )
  }
  componentDidMount() {
    this.getStoredContent()
    ipcRenderer.on('receiveUpdateRequest', (_: any, force: boolean) => {
      if (force) this.setContent()
      else {
        storage.get(
          'storageRawContent',
          (error, storageRawContent: ContentRaw) => {
            if (error) console.log(error)
            this.setContent(storageRawContent)
          },
        )
      }
    })
  }
  render() {
    const { content, contentArray } = this.state
    return (
      <Router>
        <Wrapper>
          {content && contentArray && (
            <>
              <Index content={content} />
              <Main contentArray={contentArray} />
              <ControlPanel contentArray={contentArray} />
            </>
          )}
        </Wrapper>
      </Router>
    )
  }
}

export default App
