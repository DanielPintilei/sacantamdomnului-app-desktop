import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ContentFormatted, File, Folder as FolderType } from '../formatContent'

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
  files.map((file: File) => (
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
  display: flex;
  flex-direction: column;
  width: 400px;
`
type IndexProps = {
  content: ContentFormatted
}
class Index extends React.Component<IndexProps> {
  render() {
    const { content: { songs, poems } } = this.props
    return (
      <Wrapper>
        <Folder title={songs.title}>
          <Folders folders={songs.folders} />
        </Folder>
        <Folder title={poems.title}>
          <Folders folders={poems.folders} />
        </Folder>
      </Wrapper>
    )
  }
}

export default Index
