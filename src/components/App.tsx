import * as React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import styled from 'styled-components'
import Index from './Index'
import Main from './Main'
import ControlPanel from './ControlPanel'
import formatContent, { arrayFoldersContent } from '../formatContent'
// sortFoldersContent,

const rawContent = require('../../content.json')
const content = formatContent(rawContent)
// const contentSorted = arrayFoldersContent(cantari.folders)
const contentArray = arrayFoldersContent([
  ...content.songs.folders,
  ...content.poems.folders,
])

const Wrapper = styled.div`
  display: flex;
  background-color: #fff;
`
class App extends React.Component {
  render() {
    return (
      <Router>
        <Wrapper>
          <Index content={content} />
          <Main contentArray={contentArray} />
          <ControlPanel contentArray={contentArray} />
        </Wrapper>
      </Router>
    )
  }
}

export default App
