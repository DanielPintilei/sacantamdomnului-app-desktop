import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { injectGlobal } from 'styled-components'
import App from './components/App'

injectGlobal`
  * {
    box-sizing: border-box;
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
`

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
