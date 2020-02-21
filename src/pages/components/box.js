import React from "react"
import styled from "styled-components"

const Box = styled.section`
  background-color: #eedec4;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`

export default ({ children }) => <Box>{children}</Box>
