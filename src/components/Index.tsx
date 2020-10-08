import * as React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Resizable } from 're-resizable'
import { ContentFormatted, Piece, Folder as FolderType } from '../formatContent'

const FolderWrapper = styled.div`
  min-width: 250px;
`
const ButtonFolder = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 10px;
  padding-left: 0;
  font-size: 15px;
  text-align: left;
  .dots {
    width: 10px;
    border-top: 1px dotted gray;
  }
  svg {
    margin-right: 5px;
  }
`
const FileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 21px;
  border-left: 1px dotted gray;
  & > div:last-child button:not(.opened) {
    position: relative;
    &::before {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: -1px;
      width: 1px;
      height: calc(50% - 1px);
      background-color: #fff;
    }
  }
  a {
    display: flex;
    padding: 4px 20px 4px 10px;
    font-size: 15px;
    text-decoration: none;
    color: #000;
    &:hover {
      background-color: hsla(0, 0%, 0%, 0.05);
    }
    &.active {
      background-color: hsla(0, 0%, 0%, 0.07);
    }
    & > span {
      margin-right: 5px;
    }
  }
`
type FolderProps = {
  title: string
  isSubfolder?: boolean
  defaultOpen?: boolean
}
const Folder: React.FC<FolderProps> = ({
  defaultOpen,
  title,
  isSubfolder,
  children,
}) => {
  const [opened, setOpened] = React.useState(defaultOpen)
  return (
    <FolderWrapper>
      <ButtonFolder
        type="button"
        onClick={() => setOpened((prevState) => !prevState)}
        style={{ paddingLeft: isSubfolder ? 0 : 10 }}
        className={opened ? 'opened' : ''}
      >
        {isSubfolder && <span className="dots" />}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          {!opened && <line x1="12" y1="11" x2="12" y2="17" />}
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
        {title}
      </ButtonFolder>
      {opened && <FileWrapper>{children}</FileWrapper>}
    </FolderWrapper>
  )
}

const mapIndexLinks = (files: Piece[]) =>
  files.map((file) => (
    <NavLink
      to={file.path}
      key={file.path}
      activeClassName="active"
      isActive={() => window.location.hash === `#/${file.path}`}
    >
      <span>{file.number}.</span>
      {file.title}
    </NavLink>
  ))

const Folders = ({ folders }: { folders: FolderType[] } & any) =>
  folders.map((folder: FolderType) => (
    <Folder title={folder.title} isSubfolder key={folder.title}>
      {mapIndexLinks(folder.files)}
    </Folder>
  ))

const Wrapper = styled.div`
  height: 100vh;
  padding: 10px 0 10px 4px;
  border-top: 10px solid #f1f1f1;
  overflow: scroll;
`
type IndexProps = {
  content: ContentFormatted
}
const Index: React.FC<IndexProps> = ({ content: { songs, poems } }) => {
  const [width, setWidth] = React.useState(340)
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
          setWidth(width + d.width)
        }}
        enable={{ right: true }}
        minWidth={10}
      >
        <Wrapper>
          <Folder title={songs.title} defaultOpen>
            <Folders folders={songs.folders} />
          </Folder>
          <Folder title={poems.title} defaultOpen>
            <Folders folders={poems.folders} />
          </Folder>
        </Wrapper>
      </Resizable>
    </div>
  )
}

export default Index
