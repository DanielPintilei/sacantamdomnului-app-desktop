import * as React from 'react'
import { ipcRenderer } from 'electron'
import { withRouter, Link } from 'react-router-dom'
import styled from 'styled-components'
import * as Resizable from 're-resizable'
import { Piece } from '../formatContent'
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
  overflow: scroll;
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
  padding-right: 36px;
  padding-left: 36px;
  label {
    display: flex;
    align-items: center;
    padding-top: 14px;
    padding-bottom: 14px;
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
      ::-webkit-search-cancel-button {
        position: relative;
        left: 4px;
        width: 18px;
        height: 18px;
        background-size: 18px;
        background-position: center;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>');
        -webkit-appearance: none;
      }
    }
  }
`
type SearchProps = {
  location: { pathname: string }
  contentArray: Piece[]
}
type SearchState = {
  width: number
  activeStanzas: string[]
  activeStanza: number
}
class ControlPanel extends React.Component<SearchProps, SearchState> {
  searchInput: HTMLInputElement | null
  state = {
    width: 340,
    activeStanzas: [],
    activeStanza: 0,
  }
  getFirstStanza = (getStanzaFromState?: boolean) => {
    const { pathname } = this.props.location
    const activePiece = this.props.contentArray.find(
      item => `/${item.path}` === pathname,
    )
    if (activePiece) {
      const { stanzas } = activePiece
      const activeStanza = getStanzaFromState ? this.state.activeStanza : 0
      this.setState({ activeStanzas: stanzas, activeStanza })
      return stanzas[activeStanza]
    }
    return ''
  }
  openPresentation = () => {
    ipcRenderer.send('openPresentation', this.getFirstStanza(true))
  }
  startPresentation = () => {
    ipcRenderer.send('setStanza', this.getFirstStanza())
  }
  closePresentations = () => {
    ipcRenderer.send('closePresentations')
    this.setState({ activeStanza: 0 })
  }
  resetPresentation = () => {
    ipcRenderer.send('setStanza', '')
    this.setState({ activeStanza: 0 })
  }
  changeStanza = (isPrev?: boolean) => {
    const { activeStanza } = this.state
    const sendState = (nextActiveStanza: number) =>
      this.setState(prevState => {
        const stanza = prevState.activeStanzas[nextActiveStanza]
        ipcRenderer.send('setStanza', stanza)
        return { activeStanza: nextActiveStanza }
      })
    const prevGuard = activeStanza !== 0
    const nextGuard = activeStanza !== this.state.activeStanzas.length - 1
    if (isPrev) {
      if (prevGuard) sendState(activeStanza - 1)
    } else if (nextGuard) sendState(activeStanza + 1)
  }
  componentDidMount() {
    const handleKeydown = (code: string) => {
      switch (code) {
        case 'F5':
          this.openPresentation()
          break
        case 'Enter':
          this.startPresentation()
          break
        case 'Escape':
          this.resetPresentation()
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          this.changeStanza(true)
          break
        case 'ArrowRight':
        case 'ArrowUp':
          this.changeStanza()
          break
      }
    }
    document.addEventListener('keydown', ev => {
      if (document.activeElement !== this.searchInput) handleKeydown(ev.code)
    })
    ipcRenderer.on('receivePresentationKeydown', (_: any, payload: string) =>
      handleKeydown(payload),
    )
  }
  render() {
    const { width } = this.state
    return (
      <div>
        <Resizable
          size={{ width, height: '100%' }}
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
          minWidth={10}
        >
          <Wrapper>
            <Controls>
              <nav>
                <button onClick={this.openPresentation}>
                  <IconNew />
                </button>
                <button onClick={this.startPresentation}>
                  <IconPresent />
                </button>
                <button onClick={this.closePresentations}>
                  <IconClose />
                </button>
              </nav>
              <nav>
                <button onClick={() => this.changeStanza(true)}>
                  <IconArrowLeft />
                </button>
                <button onClick={this.resetPresentation}>
                  <IconBlank />
                </button>
                <button onClick={() => this.changeStanza()}>
                  <IconArrowRight />
                </button>
              </nav>
            </Controls>
            <Form>
              <label>
                <IconSearch />
                <input
                  type="search"
                  ref={element => {
                    this.searchInput = element
                  }}
                />
              </label>
            </Form>
          </Wrapper>
        </Resizable>
      </div>
    )
  }
}

export default withRouter<any>(ControlPanel) as any
