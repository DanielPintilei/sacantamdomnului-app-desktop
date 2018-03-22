import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { injectGlobal } from 'styled-components'
import AppPresent from './components/AppPresent'
import { fontFaces } from './fonts'

injectGlobal`
  ${fontFaces}
  * {
    box-sizing: border-box;
  }
`

ReactDOM.render(<AppPresent />, document.getElementById('root') as HTMLElement)
