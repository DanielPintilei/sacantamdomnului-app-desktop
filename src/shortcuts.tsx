import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { injectGlobal } from 'styled-components'
import AppShortcuts from './components/AppShortcuts'
import { fontFaces } from './fonts'

injectGlobal`
  ${fontFaces}
  * {
    box-sizing: border-box;
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

ReactDOM.render(<AppShortcuts />, document.getElementById(
  'root',
) as HTMLElement)
