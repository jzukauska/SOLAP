import styled from 'styled-components'

import { Button } from 'grommet'

export default styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
  transition: 0.2s ease all;
  height: 50px;
  font-size: 24px;
  border-radius: 25px;
  &:hover {
    box-shadow: none;
  }
`
