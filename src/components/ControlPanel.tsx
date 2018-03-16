import * as React from 'react'
import { ipcRenderer } from 'electron'
// import { Link } from 'react-router-dom'
import styled from 'styled-components'
import * as Resizable from 're-resizable'
import {
  IconNew,
  IconPresent,
  IconClose,
  IconArrowLeft,
  IconBlank,
  IconArrowRight,
  IconSearch,
} from './Icons'

const Wrapper = styled.div`
  height: 100vh;
  overflow-y: scroll;
`
const Controls = styled.div`
  padding-right: 20px;
  padding-left: 20px;
  nav {
    display: flex;
    justify-content: space-between;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px;
    padding: 10px;
    border-radius: 4px;
    &:hover {
      background-color: hsla(0, 0%, 0%, 0.05);
    }
  }
`
const Form = styled.form`
  padding: 14px 36px;
  label {
    display: flex;
    align-items: center;
    cursor: text;
    svg {
      flex-shrink: 0;
      margin-right: 5px;
    }
    input {
      flex-grow: 1;
      margin: 0;
      padding: 4px;
      font-size: 16px;
      border: none;
      border-bottom: 2px solid #000;
      outline: none;
    }
  }
`
type SearchProps = {
  // content: ContentFormatted
}
class ControlPanel extends React.Component<SearchProps> {
  state = {
    width: 340,
  }
  render() {
    // const { content: { songs, poems } } = this.props
    const { width } = this.state
    return (
      <div>
        <Resizable
          size={{ width, height: '100vh' }}
          onResizeStop={(
            e: any,
            direction: any,
            ref: any,
            d: { width: number },
          ) => {
            this.setState({
              width: width + d.width,
            })
          }}
          enable={{ left: true }}
          minWidth={0}
        >
          <Wrapper>
            <Controls>
              <nav>
                <button
                  onClick={() => ipcRenderer.send('openPresentation', '')}
                >
                  <IconNew />
                </button>
                <button onClick={() => ipcRenderer.send('setStanza', '')}>
                  <IconPresent />
                </button>
                <button onClick={() => ipcRenderer.send('closePresentations')}>
                  <IconClose />
                </button>
              </nav>
              <nav>
                <button onClick={() => ipcRenderer.send('setStanza', '')}>
                  <IconArrowLeft />
                </button>
                <button onClick={() => ipcRenderer.send('setStanza', '')}>
                  <IconBlank />
                </button>
                <button onClick={() => ipcRenderer.send('setStanza', '')}>
                  <IconArrowRight />
                </button>
              </nav>
            </Controls>
            <Form>
              <label>
                <IconSearch />
                <input type="search" />
              </label>
            </Form>
          </Wrapper>
        </Resizable>
      </div>
    )
  }
}

export default ControlPanel
