import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { injectGlobal } from 'styled-components'
import App from './components/App'

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    border-left: 10px solid #f1f1f1;
  }
  body,
  pre {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
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
`

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
