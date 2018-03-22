import { css } from 'styled-components'

export const fontFaces = css`
  @font-face {
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: normal;
    src: local('Open Sans Regular'), local('OpenSans-Regular'),
      url('./fonts/Open_Sans/OpenSans-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: italic;
    src: local('Open Sans Italic'), local('OpenSans-Italic'),
      url('./fonts/Open_Sans/OpenSans-Italic.ttf') format('truetype');
  }
`

export const fontFamilies = css`
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
`
