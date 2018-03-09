import * as React from 'react'
import { ipcRenderer } from 'electron'
import { BrowserRouter as Router } from 'react-router-dom'
import styled from 'styled-components'
import Index from './Index'
import formatContent, {
  sortFoldersContent,
  arrayFoldersContent,
} from '../formatContent'

const rawContent = require('../../content.json')
const content = formatContent(rawContent)
// const songsSorted = sortSongContent(cantari.folders)
// const songsArray = arraySongContent(cantari.folders)

const Wrapper = styled.div`
  display: flex;
`
class App extends React.Component {
  render() {
    return (
      <Router>
        <Wrapper>
          <Index content={content} />
          <button onClick={() => ipcRenderer.send('openPresentation', '')}>
            Open presentation
          </button>
          <button onClick={() => ipcRenderer.send('setStanza', '')}>
            Send stanza
          </button>
        </Wrapper>
      </Router>
    )
  }
}

export default App
