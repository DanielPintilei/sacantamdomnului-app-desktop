import * as React from 'react'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'

const Wrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 5px;
  right: 5px;
  bottom: 5px;
  left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  user-select: none;
  -webkit-app-region: drag;
  pre {
    max-height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    font-size: 40px;
    line-height: 1.4;
    tab-size: 0;
    white-space: pre-wrap;
    color: #fff;
    &,
    p {
      margin: 0;
    }
    h1 {
      margin: 0 0 1em;
      font-size: 1.2em;
      font-weight: normal;
      line-height: 1.2;
    }
    p {
      text-align: center;
    }
  }
`

class AppPresent extends React.Component {
  state = {
    stanza: '',
  }
  componentDidMount() {
    document.addEventListener('keydown', ev =>
      ipcRenderer.send('presentationKeydown', ev.code),
    )
    const setState = (_: any, payload: string) => {
      this.setState({ stanza: payload })
    }
    ipcRenderer.on('openPresentation', setState)
    ipcRenderer.on('setStanza', setState)
  }
  render() {
    const { stanza } = this.state
    return (
      <Wrapper>
        <pre dangerouslySetInnerHTML={{ __html: stanza }} />
      </Wrapper>
    )
  }
}

export default AppPresent
