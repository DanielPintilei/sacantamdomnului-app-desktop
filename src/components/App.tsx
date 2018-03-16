import * as React from 'react'
import { ipcRenderer } from 'electron'
import { HashRouter as Router } from 'react-router-dom'
import styled from 'styled-components'
import Index from './Index'
import Main from './Main'
import Search from './Search'
import formatContent, {
  sortFoldersContent,
  arrayFoldersContent,
} from '../formatContent'

const rawContent = require('../../content.json')
const content = formatContent(rawContent)
// const contentSorted = arrayFoldersContent(cantari.folders)
const contentArray = arrayFoldersContent([
  ...content.songs.folders,
  ...content.poems.folders,
])

const Wrapper = styled.div`
  display: flex;
`
class App extends React.Component {
  render() {
    return (
      <Router>
        <Wrapper>
          <Index content={content} />
          <Main contentArray={contentArray} />
          <Search />
        </Wrapper>
      </Router>
    )
  }
}

export default App
