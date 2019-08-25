import * as storage from 'electron-json-storage'
import * as React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import styled from 'styled-components'
import Index from './Index'
import Main from './Main'
import ControlPanel from './ControlPanel'
import fetchContent, { fetchVersions } from '../fetchContent'
import formatContent, {
  arrayFoldersContent,
  ContentFormatted,
  Piece,
  ContentRaw,
} from '../formatContent'

storage.setDataPath()

const Wrapper = styled.div`
  display: flex;
  background-color: #fff;
`

type AppState = {
  content?: ContentFormatted
  contentArray?: Piece[]
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    content: undefined,
    contentArray: undefined,
  }
  setContent = (storageRawContent: Object, child?: string) => {
    fetchContent(child ? `/${child}` : '').then((rawContent: any) => {
      const mergedRawContent: ContentRaw = child
        ? { ...storageRawContent, [child]: rawContent }
        : { ...storageRawContent, ...rawContent }
      const content = formatContent(mergedRawContent)
      const contentArray = arrayFoldersContent([
        ...content.songs.folders,
        ...content.poems.folders,
      ])
      storage.set('storageRawContent', mergedRawContent, (error: any) => {
        if (error) throw error
      })
      storage.set('content', content, (error: any) => {
        if (error) throw error
      })
      storage.set('contentArray', contentArray, (error: any) => {
        if (error) throw error
      })
      this.setState({ content, contentArray })
    })
  }
  getStoredContent = () => {
    storage.getMany(
      ['content', 'contentArray'],
      (error: any, { content, contentArray }: AppState) => {
        if (error) console.log(error)
        this.setState({
          content: content && Object.keys(content).length ? content : undefined,
          contentArray:
            contentArray && contentArray.length ? contentArray : undefined,
        })
      },
    )
  }
  componentDidMount () {
    this.getStoredContent()
    fetchVersions()
      .then((fetchedVersions: any) => {
        storage.getMany(
          ['storageVersions', 'storageRawContent'],
          (
            error: any,
            {
              storageVersions,
              storageRawContent,
            }: { storageVersions: Object; storageRawContent: Object },
          ) => {
            if (error) throw error
            if (
              storageRawContent &&
              Object.keys(storageRawContent).length >= 4
            ) {
              for (const key of Object.keys(fetchedVersions)) {
                if (
                  !!storageVersions[key] &&
                  fetchedVersions[key] > storageVersions[key]
                ) {
                  this.setContent(storageRawContent, key)
                }
              }
            } else {
              this.setContent(storageRawContent)
            }
          },
        )
        storage.set('storageVersions', fetchedVersions, (error: any) => {
          if (error) throw error
        })
      })
      .catch((error: any) => {
        console.log(error)
        this.getStoredContent()
      })
  }
  render () {
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
