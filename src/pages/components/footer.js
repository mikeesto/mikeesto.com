import React from "react"
import styled from "styled-components"
import Link from "./link"

const Footer = styled.div`
  text-align: center;
  color: #eedec4;
  font-size: 14px;
`

const Underline = styled.span`
  border-bottom: 1px dotted #eedec4;
`

export default () => (
  <Footer>
    Made with <Underline>Gatsby</Underline>. Hosted on{" "}
    <Underline>
      <Link href="https://netlify.com" nocolour={true}>
        Netlify
      </Link>
    </Underline>
    .
  </Footer>
)
