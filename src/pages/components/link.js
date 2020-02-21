import React from "react"
import styled from "styled-components"

const Link = styled.a`
  color: ${props => (props.nocolour ? "#eedec4" : "#1565c0")};
  text-decoration: none;

  &:hover {
    border-bottom: 1px dotted black;
    cursor: pointer;
  }
`

export default ({ href, children, nocolour }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    nocolour={nocolour}
  >
    {children}
  </Link>
)
