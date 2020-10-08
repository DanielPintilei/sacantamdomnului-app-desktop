import * as React from 'react'
import { ipcRenderer } from 'electron'
import {
  withRouter,
  Link,
  LinkProps,
  RouteComponentProps,
} from 'react-router-dom'
import styled from 'styled-components'
import { Resizable } from 're-resizable'
import ReactTooltip from 'react-tooltip'
import { replaceAccents } from '../formatContent'
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
  overflow-x: scroll;
  display: flex;
  flex-direction: column;
  border-top: 10px solid #f1f1f1;
  & > * {
    min-width: 250px;
  }
  .tooltip {
    display: flex;
    justify-content: space-between;
    div {
      margin-left: 15px;
      opacity: 0.7;
    }
  }
`
const Controls = styled.div`
  flex-shrink: 0;
  padding-top: 15px;
  padding-right: 20px;
  padding-left: 20px;
  overflow-y: scroll;
  nav {
    display: flex;
    justify-content: space-between;
  }
  button {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 70px;
    justify-content: center;
    margin: 4px;
    padding: 10px;
    font-size: 10px;
    border-radius: 4px;
    &:hover {
      background-color: hsla(0, 0%, 0%, 0.05);
    }
    svg {
      margin-bottom: 5px;
    }
  }
`
const Form = styled.form`
  flex-shrink: 0;
  padding-right: 36px;
  padding-left: 36px;
  overflow-y: scroll;
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
      width: 100%;
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
const Results = styled.div`
  flex-grow: 1;
  padding: 10px 32px;
  overflow-y: scroll;
  a {
    display: flex;
    padding: 4px 20px 4px 10px;
    font-size: 15px;
    text-decoration: none;
    color: #000;
    &:hover {
      background-color: hsla(0, 0%, 0%, 0.05);
    }
    & > span {
      margin-right: 5px;
    }
  }
`
const UpdateMessage = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 250px;
  max-height: 200px;
  padding: 15px;
  text-align: center;
  color: #4d4d4d;
  background-color: #c6ff00;
  border-radius: 3px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`
type ControlPanelProps = RouteComponentProps<{
  location: string
}> & {
  contentArray: Piece[]
}
type ControlPanelState = {
  width: number
  activeStanzas: string[]
  activeStanza: number
  searchInputValue: string
  searchResults: React.ReactElement<LinkProps>[]
  updateMessage: string
}
class ControlPanel extends React.Component<
  ControlPanelProps,
  ControlPanelState
> {
  searchInput: HTMLInputElement | null
  state = {
    width: 340,
    activeStanzas: [],
    activeStanza: 0,
    searchInputValue: '',
    searchResults: [],
    updateMessage: '',
  }
  getFirstStanza = (getStanzaFromState?: boolean) => {
    const { pathname } = this.props.location
    const activePiece = this.props.contentArray.find(
      (item) => `/${item.path}` === pathname,
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
      this.setState((prevState) => {
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
  handleSearchInputChange = (event: { target: { value: string } }) => {
    this.setState({ searchInputValue: event.target.value })
  }
  onSearchSubmit = (ev: { preventDefault: () => void }) => {
    ev.preventDefault()
    const { searchInputValue } = this.state
    const searchResults = this.props.contentArray
      .filter(({ number, title }) => {
        const formattedTitle = replaceAccents(title).toLowerCase()
        const searchText = new RegExp(`\\b${searchInputValue}`, 'ig')
        return (
          (searchInputValue &&
            number.toString().startsWith(searchInputValue)) ||
          ((formattedTitle
            .replace(/[^\w\s]|_/g, '')
            .replace(/\s+/g, ' ')
            .match(searchText) ||
            formattedTitle.match(searchText)) &&
            searchInputValue.length > 1)
        )
      })
      .sort((a, b) => a.number - b.number)
      .map(({ number, title, path }) => (
        <Link key={path} to={path} tabIndex={1}>
          <span>{number}.</span>
          {title}
        </Link>
      ))
    this.setState({ searchResults })
  }
  focusSearchInput = () => {
    const { searchInput } = this
    if (searchInput) {
      searchInput.focus()
      searchInput.select()
    }
  }
  setZoom(code: string) {
    ipcRenderer.send('zoom', code)
  }
  handleKeydown = ({ code, ctrlKey }: KeyboardEvent) => {
    switch (code) {
      case 'F5':
        if (ctrlKey) this.openPresentation()
        else this.startPresentation()
        break
      case 'F8':
        this.closePresentations()
        break
      case 'ArrowLeft':
        this.changeStanza(true)
        break
      case 'Escape':
        this.resetPresentation()
        break
      case 'ArrowRight':
        this.changeStanza()
        break
      case 'F3':
        this.focusSearchInput()
        break
      case 'Digit0':
      case 'Minus':
      case 'Equal':
        if (ctrlKey) this.setZoom(code)
        break
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', (ev) => {
      if (document.activeElement !== this.searchInput) this.handleKeydown(ev)
    })
    ipcRenderer.on(
      'receivePresentationKeydown',
      (_: any, payload: KeyboardEvent) => this.handleKeydown(payload),
    )
    ipcRenderer.on(
      'updateMessage',
      (_: any, { text, isDone }: { text: string; isDone: boolean }) => {
        this.setState({ updateMessage: text })
        if (isDone) setTimeout(() => this.setState({ updateMessage: '' }), 7000)
      },
    )
    const LOCAL_STORAGE_ALERT = 'LOCAL_STORAGE_ALERT'
    if (!localStorage.getItem(LOCAL_STORAGE_ALERT)) {
      alert(
        'Slăvit să fie Domnul.\n\nCu ajutorul Lui, aplicația va avea update-uri.\nAcestea se vor face automat la deschidere dacă va exista conexiune la internet.',
      )
      ipcRenderer.send('showShortcutsWindow')
      localStorage.setItem(LOCAL_STORAGE_ALERT, 'true')
    }
  }
  render() {
    const { width, searchResults, updateMessage } = this.state
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
            <ReactTooltip
              place="bottom"
              effect="solid"
              delayShow={1500}
              className="tooltip"
              html
            />
            <Controls>
              <nav>
                <button
                  onClick={this.openPresentation}
                  data-tip="Deschidere fereastră de prezentare<div>Ctrl + F5</div>"
                  className="button"
                  tabIndex={1}
                >
                  {IconNew}
                  Fereastră
                  <br />
                  nouă
                </button>
                <button
                  onClick={this.startPresentation}
                  data-tip="Afișare cântare curentă<div>F5</div>"
                  className="button"
                  tabIndex={1}
                >
                  {IconPresent}
                  Afișare
                  <br />
                  cântare
                </button>
                <button
                  onClick={this.closePresentations}
                  data-tip="Închidere ferestre de prezentare<div>F8</div>"
                  className="button"
                  tabIndex={1}
                >
                  {IconClose}
                  Închidere
                  <br />
                  ferestre
                </button>
              </nav>
              <nav>
                <button
                  onClick={() => this.changeStanza(true)}
                  data-tip="Afișare strofă precedentă<div>Săgeată Stânga</div>"
                  className="button"
                  tabIndex={1}
                >
                  {IconArrowLeft}
                  Strofa
                  <br />
                  precedentă
                </button>
                <button
                  onClick={this.resetPresentation}
                  data-tip="Anulare afișare cântare curentă<div>Esc</div>"
                  className="button"
                  tabIndex={1}
                >
                  {IconBlank}
                  Anulare
                  <br />
                  afișare
                </button>
                <button
                  onClick={() => this.changeStanza()}
                  data-tip="Afișare strofă următoare<div>Săgeată Dreapta</div>"
                  className="button"
                  tabIndex={1}
                >
                  {IconArrowRight}
                  Strofa
                  <br />
                  următoare
                </button>
              </nav>
            </Controls>
            <Form onSubmit={this.onSearchSubmit}>
              <label>
                {IconSearch}
                <input
                  type="search"
                  value={this.state.searchInputValue}
                  onChange={this.handleSearchInputChange}
                  ref={(element) => {
                    this.searchInput = element
                  }}
                  tabIndex={1}
                />
              </label>
            </Form>
            {searchResults && <Results>{searchResults}</Results>}
            {updateMessage && <UpdateMessage>{updateMessage}</UpdateMessage>}
          </Wrapper>
        </Resizable>
      </div>
    )
  }
}

export default withRouter(ControlPanel)

// import React, { useState, useEffect, FC } from 'react'
// import { ipcRenderer } from 'electron'
// import {
//   withRouter,
//   Link,
//   // LinkProps,
//   RouteComponentProps,
// } from 'react-router-dom'
// import styled from 'styled-components'
// import { Resizable } from 're-resizable'
// import ReactTooltip from 'react-tooltip'
// import { replaceAccents } from '../formatContent'
// import { Piece } from '../formatContent'
// import {
//   IconNew,
//   IconPresent,
//   IconClose,
//   IconArrowLeft,
//   IconBlank,
//   IconArrowRight,
//   IconSearch,
// } from './Icons'

// const Wrapper = styled.div`
//   height: 100vh;
//   overflow-x: scroll;
//   display: flex;
//   flex-direction: column;
//   border-top: 10px solid #f1f1f1;
//   & > * {
//     min-width: 250px;
//   }
//   .tooltip {
//     display: flex;
//     justify-content: space-between;
//     div {
//       margin-left: 15px;
//       opacity: 0.7;
//     }
//   }
// `
// const Controls = styled.div`
//   flex-shrink: 0;
//   padding-top: 15px;
//   padding-right: 20px;
//   padding-left: 20px;
//   overflow-y: scroll;
//   nav {
//     display: flex;
//     justify-content: space-between;
//   }
//   button {
//     flex-shrink: 0;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     min-width: 70px;
//     justify-content: center;
//     margin: 4px;
//     padding: 10px;
//     font-size: 10px;
//     border-radius: 4px;
//     &:hover {
//       background-color: hsla(0, 0%, 0%, 0.05);
//     }
//     svg {
//       margin-bottom: 5px;
//     }
//   }
// `
// const Form = styled.form`
//   flex-shrink: 0;
//   padding-right: 36px;
//   padding-left: 36px;
//   overflow-y: scroll;
//   label {
//     display: flex;
//     align-items: center;
//     padding-top: 14px;
//     padding-bottom: 14px;
//     cursor: text;
//     svg {
//       flex-shrink: 0;
//       margin-right: 5px;
//     }
//     input {
//       flex-grow: 1;
//       width: 100%;
//       margin: 0;
//       padding: 4px;
//       font-size: 16px;
//       border: none;
//       border-bottom: 2px solid #000;
//       outline: none;
//       ::-webkit-search-cancel-button {
//         position: relative;
//         left: 4px;
//         width: 18px;
//         height: 18px;
//         background-size: 18px;
//         background-position: center;
//         background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>');
//         -webkit-appearance: none;
//       }
//     }
//   }
// `
// const Results = styled.div`
//   flex-grow: 1;
//   padding: 10px 32px;
//   overflow-y: scroll;
//   a {
//     display: flex;
//     padding: 4px 20px 4px 10px;
//     font-size: 15px;
//     text-decoration: none;
//     color: #000;
//     &:hover {
//       background-color: hsla(0, 0%, 0%, 0.05);
//     }
//     & > span {
//       margin-right: 5px;
//     }
//   }
// `
// const UpdateMessage = styled.div`
//   position: absolute;
//   bottom: 20px;
//   right: 20px;
//   width: 250px;
//   max-height: 200px;
//   padding: 15px;
//   text-align: center;
//   color: #4d4d4d;
//   background-color: #c6ff00;
//   border-radius: 3px;
//   box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2);
//   overflow-y: auto;
// `
// type ControlPanelProps = RouteComponentProps<{
//   location: string
// }> & {
//   contentArray: Piece[]
// }
// // type ControlPanelState = {
// //   width: number
// //   activeStanzas: string[]
// //   activeStanza: number
// //   searchInputValue: string
// //   searchResults: React.ReactElement<LinkProps>[]
// //   updateMessage: string
// // }
// const ControlPanel: FC<ControlPanelProps> = ({ location, contentArray }) => {
//   let searchInput: HTMLInputElement | null
//   const [width, setWidth] = useState(340)
//   const [activeStanzas, setActiveStanzas] = useState([])
//   const [activeStanza, setActiveStanza] = useState(0)
//   const [searchInputValue, setSearchInputValue] = useState('')
//   const [searchResults, setSearchResults] = useState([])
//   const [updateMessage, setUpdateMessage] = useState('')
//   const getFirstStanza = (getStanzaFromState?: boolean) => {
//     const { pathname } = location
//     const activePiece = contentArray.find(
//       (item) => `/${item.path}` === pathname,
//     )
//     if (activePiece) {
//       const { stanzas } = activePiece
//       const newActiveStanza = getStanzaFromState ? activeStanza : 0
//       setActiveStanza(newActiveStanza)
//       return stanzas[newActiveStanza]
//     }
//     return ''
//   }
//   const openPresentation = () => {
//     ipcRenderer.send('openPresentation', getFirstStanza(true))
//   }
//   const startPresentation = () => {
//     ipcRenderer.send('setStanza', getFirstStanza())
//   }
//   const closePresentations = () => {
//     ipcRenderer.send('closePresentations')
//     setActiveStanza(0)
//   }
//   const resetPresentation = () => {
//     ipcRenderer.send('setStanza', '')
//     setActiveStanza(0)
//   }
//   const changeStanza = (isPrev?: boolean) => {
//     // const sendState = (nextActiveStanza: number) =>
//     //   setActiveStanza((prevState) => {
//     //     const stanza = prevState[nextActiveStanza]
//     //     ipcRenderer.send('setStanza', stanza)
//     //     return nextActiveStanza
//     //   })
//     const prevGuard = activeStanza !== 0
//     const nextGuard = activeStanza !== activeStanzas.length - 1
//     if (isPrev) {
//       if (prevGuard) sendState(activeStanza - 1)
//     } else if (nextGuard) sendState(activeStanza + 1)
//   }
//   const handleSearchInputChange = (event: { target: { value: string } }) => {
//     setSearchInputValue(event.target.value)
//   }
//   const onSearchSubmit = (ev: { preventDefault: () => void }) => {
//     ev.preventDefault()
//     const newSearchResults = contentArray
//       .filter(({ number, title }) => {
//         const formattedTitle = replaceAccents(title).toLowerCase()
//         const searchText = new RegExp(`\\b${searchInputValue}`, 'ig')
//         return (
//           (searchInputValue &&
//             number.toString().startsWith(searchInputValue)) ||
//           ((formattedTitle
//             .replace(/[^\w\s]|_/g, '')
//             .replace(/\s+/g, ' ')
//             .match(searchText) ||
//             formattedTitle.match(searchText)) &&
//             searchInputValue.length > 1)
//         )
//       })
//       .sort((a, b) => a.number - b.number)
//       .map(({ number, title, path }) => (
//         <Link key={path} to={path} tabIndex={1}>
//           <span>{number}.</span>
//           {title}
//         </Link>
//       ))
//     setSearchResults(newSearchResults)
//   }
//   const focusSearchInput = () => {
//     if (searchInput) {
//       searchInput.focus()
//       searchInput.select()
//     }
//   }
//   const setZoom = (code: string) => {
//     ipcRenderer.send('zoom', code)
//   }
//   const handleKeydown = ({ code, ctrlKey }: KeyboardEvent) => {
//     switch (code) {
//       case 'F5':
//         if (ctrlKey) openPresentation()
//         else startPresentation()
//         break
//       case 'F8':
//         closePresentations()
//         break
//       case 'ArrowLeft':
//         changeStanza(true)
//         break
//       case 'Escape':
//         resetPresentation()
//         break
//       case 'ArrowRight':
//         changeStanza()
//         break
//       case 'F3':
//         focusSearchInput()
//         break
//       case 'Digit0':
//       case 'Minus':
//       case 'Equal':
//         if (ctrlKey) setZoom(code)
//         break
//     }
//   }
//   useEffect(() => {
//     document.addEventListener('keydown', (ev) => {
//       if (document.activeElement !== searchInput) handleKeydown(ev)
//     })
//     ipcRenderer.on(
//       'receivePresentationKeydown',
//       (_: any, payload: KeyboardEvent) => handleKeydown(payload),
//     )
//     ipcRenderer.on(
//       'updateMessage',
//       (_: any, { text, isDone }: { text: string; isDone: boolean }) => {
//         setState({ updateMessage: text })
//         if (isDone) setTimeout(() => setState({ updateMessage: '' }), 7000)
//       },
//     )
//     const LOCAL_STORAGE_ALERT = 'LOCAL_STORAGE_ALERT'
//     if (!localStorage.getItem(LOCAL_STORAGE_ALERT)) {
//       alert(
//         'Slăvit să fie Domnul.\n\nCu ajutorul Lui, aplicația va avea update-uri.\nAcestea se vor face automat la deschidere dacă va exista conexiune la internet.',
//       )
//       ipcRenderer.send('showShortcutsWindow')
//       localStorage.setItem(LOCAL_STORAGE_ALERT, 'true')
//     }
//   }, [])
//   return (
//     <div>
//       <Resizable
//         size={{ width, height: '100%' }}
//         onResizeStop={(
//           e: any,
//           direction: any,
//           ref: any,
//           d: { width: number },
//         ) => {
//           setWidth(width + d.width)
//         }}
//         enable={{ left: true }}
//         minWidth={10}
//       >
//         <Wrapper>
//           <ReactTooltip
//             place="bottom"
//             effect="solid"
//             delayShow={1500}
//             className="tooltip"
//             html
//           />
//           <Controls>
//             <nav>
//               <button
//                 onClick={openPresentation}
//                 data-tip="Deschidere fereastră de prezentare<div>Ctrl + F5</div>"
//                 className="button"
//                 tabIndex={1}
//               >
//                 {IconNew}
//                 Fereastră
//                 <br />
//                 nouă
//               </button>
//               <button
//                 onClick={startPresentation}
//                 data-tip="Afișare cântare curentă<div>F5</div>"
//                 className="button"
//                 tabIndex={1}
//               >
//                 {IconPresent}
//                 Afișare
//                 <br />
//                 cântare
//               </button>
//               <button
//                 onClick={closePresentations}
//                 data-tip="Închidere ferestre de prezentare<div>F8</div>"
//                 className="button"
//                 tabIndex={1}
//               >
//                 {IconClose}
//                 Închidere
//                 <br />
//                 ferestre
//               </button>
//             </nav>
//             <nav>
//               <button
//                 onClick={() => changeStanza(true)}
//                 data-tip="Afișare strofă precedentă<div>Săgeată Stânga</div>"
//                 className="button"
//                 tabIndex={1}
//               >
//                 {IconArrowLeft}
//                 Strofa
//                 <br />
//                 precedentă
//               </button>
//               <button
//                 onClick={resetPresentation}
//                 data-tip="Anulare afișare cântare curentă<div>Esc</div>"
//                 className="button"
//                 tabIndex={1}
//               >
//                 {IconBlank}
//                 Anulare
//                 <br />
//                 afișare
//               </button>
//               <button
//                 onClick={() => changeStanza()}
//                 data-tip="Afișare strofă următoare<div>Săgeată Dreapta</div>"
//                 className="button"
//                 tabIndex={1}
//               >
//                 {IconArrowRight}
//                 Strofa
//                 <br />
//                 următoare
//               </button>
//             </nav>
//           </Controls>
//           <Form onSubmit={onSearchSubmit}>
//             <label>
//               {IconSearch}
//               <input
//                 type="search"
//                 value={searchInputValue}
//                 onChange={handleSearchInputChange}
//                 ref={(element) => {
//                   searchInput = element
//                 }}
//                 tabIndex={1}
//               />
//             </label>
//           </Form>
//           {searchResults && <Results>{searchResults}</Results>}
//           {updateMessage && <UpdateMessage>{updateMessage}</UpdateMessage>}
//         </Wrapper>
//       </Resizable>
//     </div>
//   )
// }

// export default withRouter(ControlPanel)
