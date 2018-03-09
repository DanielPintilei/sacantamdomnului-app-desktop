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
  font-size: 32px;
  color: #fff;
  background-color: #000;
  -webkit-app-region: drag;
`

class AppPresent extends React.Component {
  state = {
    stanza: '',
  }
  componentDidMount () {
    const setState = (_: any, payload: string) => {
      this.setState({ stanza: payload })
      console.log(payload)
    }
    ipcRenderer.on('openPresentation', setState)
    ipcRenderer.on('setStanza', setState)
  }
  render () {
    const { stanza } = this.state
    return (
      <Wrapper>
        <div>{stanza}</div>
      </Wrapper>
    )
  }
}

export default AppPresent
