import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import App from './components/App'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: normal;
    src: local('Open Sans Regular'), local('OpenSans-Regular'),
      url('../fonts/Open_Sans/OpenSans-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: italic;
    src: local('Open Sans Italic'), local('OpenSans-Italic'),
      url('../fonts/Open_Sans/OpenSans-Italic.ttf') format('truetype');
  }
  * {
    box-sizing: border-box;
    outline-color: #e0b152;
  }
  body {
    border-left: 10px solid #f1f1f1;
  }
  body,
  pre {
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
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
  ::selection {
    color: #fff;
    background-color: #000;
  }
`

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root') as HTMLElement,
)
