import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import * as Resizable from 're-resizable'
import { ContentFormatted, Piece, Folder as FolderType } from '../formatContent'

const FileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
type FolderProps = {
  title: string
}
type FolderState = {
  opened: boolean
}
class Folder extends React.Component<FolderProps, FolderState> {
  state = {
    opened: false,
  }
  render() {
    const { title, children } = this.props
    const { opened } = this.state
    return (
      <div>
        <button
          type="button"
          onClick={() =>
            this.setState(prevState => ({ opened: !prevState.opened }))
          }
        >
          {title}
        </button>
        {opened && <FileWrapper>{children}</FileWrapper>}
      </div>
    )
  }
}

const mapIndexLinks = (files: any[]) =>
  files.map((file: Piece) => (
    <Link to={file.path} key={file.path}>
      {file.title}
    </Link>
  ))
const Folders = ({ folders }: any) =>
  folders.map((folder: FolderType) => (
    <Folder title={folder.title} key={folder.title}>
      {mapIndexLinks(folder.files)}
    </Folder>
  ))

const Wrapper = styled.div`
  .inner {
    height: 100vh;
    overflow-y: scroll;
    & > div {
      min-width: 250px;
      & > button {
        display: block;
        width: 100%;
        padding: 10px 15px;
        font-size: 15px;
        text-align: left;
        background-color: hsla(0, 0%, 0%, 0.05);
        box-shadow: 0 2px 3px 0 hsla(0, 0%, 0%, 0.1);
      }
      &:first-child > button {
        box-shadow: inset 0 2px 3px 0 hsla(0, 0%, 0%, 0.1),
          0 2px 3px 0 hsla(0, 0%, 0%, 0.1);
      }
    }
  }
`
type IndexProps = {
  content: ContentFormatted
}
class Index extends React.Component<IndexProps> {
  state = {
    width: 340,
  }
  render() {
    const { content: { songs, poems } } = this.props
    const { width } = this.state
    return (
      <Wrapper>
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
          enable={{ right: true }}
          minWidth={0}
        >
          <div className="inner">
            <Folder title={songs.title}>
              <Folders folders={songs.folders} />
            </Folder>
            <Folder title={poems.title}>
              <Folders folders={poems.folders} />
            </Folder>
          </div>
        </Resizable>
      </Wrapper>
    )
  }
}

export default Index
