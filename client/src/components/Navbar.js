import React from 'react'

import { Box } from 'grommet'

import styled from 'styled-components'

const NavbarContainer = styled(Box)`
  height: 50px;
  width: 100%;
  background-color: #0ca7d3;
`

const Navbar = () => {
  return <NavbarContainer pad="small">Navbar</NavbarContainer>
}

export default Navbar
