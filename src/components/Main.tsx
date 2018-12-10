import * as React from 'react'
import styled from 'styled-components'
import { Route } from 'react-router-dom'
import BackgroundImage from './BackgroundImage'
import { Piece } from '../formatContent'

const StyledPiece = styled.article`
  position: relative;
  min-height: 100%;
  padding: 40px 15px;
  color: #000;
  h1 {
    display: inline-block;
    margin-top: 0;
    margin-bottom: 25px;
    max-width: 400px;
    font-size: 22px;
    font-weight: 400;
    line-height: 1.2;
    position: relative;
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0.5em;
      bottom: 0;
      left: 5px;
      right: 5px;
      background-color: hsla(0, 0%, 0%, 0.05);
    }
  }
  p {
    margin-top: 0;
    font-size: 18px;
    line-height: 1.4;
  }
  pre {
    margin: 0 0 40px;
    white-space: pre-wrap;
    font-size: 18px;
    line-height: 1.4;
    tab-size: 2;
    em {
      display: inline-block;
      width: 100%;
      z-index: 1;
      font-style: italic;
      background-color: #fff;
      &::before,
      &::after {
        display: block;
        content: '';
        position: absolute;
        width: 100%;
        height: 0.5em;
        background-color: #fff;
      }
      &::before {
        top: -0.5em;
        border-top: 1px solid #fff;
      }
      &::after {
        bottom: -0.5em;
        border-bottom: 1px solid #fff;
      }
      &.sticky {
        position: sticky;
        top: 0.5em;
        margin-left: -4px;
        &::before,
        &::after {
          border-color: lightgray;
        }
      }
    }
    small {
      opacity: 0.5;
    }
  }
`
type PieceProps = {
  match: { params: { path: string } }
  contentArray: Piece[]
}
const Piece: React.StatelessComponent<PieceProps> = ({
  match: {
    params: { path },
  },
  contentArray,
}) => {
  const currentPiece = contentArray.find(piece => piece.path === path)!
  if (currentPiece) {
    return (
      <StyledPiece>
        <h1>
          {currentPiece.number}. {currentPiece.title}
        </h1>
        {currentPiece.description && <p>{currentPiece.description}</p>}
        <pre dangerouslySetInnerHTML={{ __html: currentPiece.content }} />
      </StyledPiece>
    )
  }
  return null
}

const StyledMain = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  height: 100vh;
  overflow: scroll;
`
type MainProps = {
  contentArray: Piece[]
}
const Main: React.StatelessComponent<MainProps> = ({ contentArray }) => (
  <StyledMain>
    <Route exact path="/" component={BackgroundImage} />
    {contentArray.length ? (
      <Route
        path="/:path"
        render={props => <Piece contentArray={contentArray} {...props} />}
      />
    ) : null}
  </StyledMain>
)

export default Main
