import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import * as Resizable from 're-resizable'

const Wrapper = styled.div`
  /* display: flex;
  flex-direction: column;
  width: 340px;
  height: 100vh;
  overflow-y: scroll; */
  .inner {
    height: 100vh;
    overflow-y: scroll;
  }
`
type SearchProps = {
  // content: ContentFormatted
}
class Search extends React.Component<SearchProps> {
  state = {
    width: 340,
  }
  render() {
    // const { content: { songs, poems } } = this.props
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
          enable={{ left: true }}
          minWidth={0}
        >
          <div className="inner">{''}</div>
        </Resizable>
      </Wrapper>
    )
  }
}

export default Search
