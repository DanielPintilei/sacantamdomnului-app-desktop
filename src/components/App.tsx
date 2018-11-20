import * as storage from 'electron-json-storage'
import * as React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
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

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: normal;
    src: local('Open Sans Regular'), local('OpenSans-Regular'),
      url('../fonts/Open_Sans/OpenSans-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: italic;
    src: local('Open Sans Italic'), local('OpenSans-Italic'),
      url('../fonts/Open_Sans/OpenSans-Italic.ttf') format('truetype');
  }
  * {
    box-sizing: border-box;
  }
  body {
    border-left: 10px solid #f1f1f1;
  }
  body,
  pre {
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  }
  a {
    display: block;
    text-decoration: none;
  }
  button,
  .button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
  }
  .button {
    &:active {
      transform: scale(0.9);
    }
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background-color: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background-color: hsla(0, 0%, 0%, 0.1);
  }
  ::selection {
    color: #fff;
    background-color: #000;
  }
`

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
  componentDidMount() {
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
  render() {
    const { content, contentArray } = this.state
    return (
      <Router>
        <Wrapper>
          <GlobalStyle />
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
