import * as React from 'react'
import styled from 'styled-components'
import { fontFamilies } from '../fonts'
import {
  IconNew,
  IconPresent,
  IconClose,
  IconArrowLeft,
  IconBlank,
  IconArrowRight,
  IconSearch,
} from './Icons'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  ${fontFamilies};
  background-color: #fff;
  user-select: none;
  cursor: default;
  & > div {
    display: flex;
    align-items: center;
    padding-top: 7px;
    padding-right: 5px;
    padding-bottom: 7px;
    i {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      min-width: 24px;
      min-height: 24px;
      margin-right: 5px;
    }
    small {
      flex-grow: 1;
      margin-right: 15px;
      margin-left: 15px;
      border-bottom: 1px dotted lightgray;
    }
    span {
      margin-left: auto;
    }
  }
`
const AppShortcuts = () => (
  <Wrapper>
    <div>
      <i>
        <IconNew />
      </i>
      Deschidere fereastră de prezentare:<small />
      <span>F5</span>
    </div>
    <div>
      <i>
        <IconPresent />
      </i>
      Afișare cântare curentă:<small />
      <span>Enter</span>
    </div>
    <div>
      <i>
        <IconClose />
      </i>
      Închidere ferestre de prezentare:<small />
      <span>F8</span>
    </div>
    <div>
      <i>
        <IconArrowLeft />
      </i>
      Afișare strofă precedentă:<small />
      <span>Săgeată Stânga</span>
    </div>
    <div>
      <i>
        <IconArrowRight />
      </i>
      Afișare strofă următoare:<small />
      <span>Săgeată Dreapta</span>
    </div>
    <div>
      <i>
        <IconBlank />
      </i>
      Anulare afișare cântare curentă:<small />
      <span>Esc</span>
    </div>
    <div>
      <i>
        <IconSearch />
      </i>
      Căutare:<small />
      <span>F3</span>
    </div>
    <div>
      <i />
      Zoom In:<small />
      <span>Ctrl+=</span>
    </div>
    <div>
      <i />
      Zoom Out:<small />
      <span>Ctrl+-</span>
    </div>
    <div>
      <i />
      Zoom Reset:<small />
      <span>Ctrl+0</span>
    </div>
    <div>
      <i />
      Full Screen:<small />
      <span>F11</span>
    </div>
    <div>
      <i />
      Scroll Up:<small />
      <span>Săgeată Sus</span>
    </div>
    <div>
      <i />
      Scroll Down:<small />
      <span>Săgeată Jos</span>
    </div>
    <div>
      <i />
      Închidere fereastră:<small />
      <span>Ctrl+W</span>
    </div>
  </Wrapper>
)

export default AppShortcuts
