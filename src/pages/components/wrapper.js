import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 35px;

  @media (max-width: 425px) {
    padding: 10px;
  }
`

export default ({ children }) => <Wrapper>{children}</Wrapper>
