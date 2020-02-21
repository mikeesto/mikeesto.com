import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 35px;
`

export default ({ children }) => <Wrapper>{children}</Wrapper>
