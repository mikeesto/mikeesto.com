import React from "react"
import styled from "styled-components"

const Box = styled.section`
  background-color: var(--box-color);
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: var(--box-border);
`

export default ({ children }) => <Box>{children}</Box>
